import Smooth from 'smooth-scrolling';
// const { clamp01, inverseLerp } = require('canvas-sketch-util/math');

class Custom extends Smooth {
  constructor(opt) {
    super(opt);
    this.observer = new IntersectionObserver(this.handleObserve, {
      root: null,
      rootMargin: '20px',
      threshold: [0, 0.2],
    });
    this.createExtraBound();
    this.resizing = false;
    this.cache = null;
    this.dom.divs = opt.divs;
    this.cb = opt.cb ? opt.cb.bind(this) : null;
    this.footer = opt.footer;
    this.observe();
  }

  createExtraBound() {
    ['getCache', 'inViewport'].forEach((fn) => (this[fn] = this[fn].bind(this)));
  }

  resize() {
    this.resizing = true;
    this.vars.bounding =
      this.dom.section.getBoundingClientRect().height + this.footer.getBoundingClientRect().height - this.vars.height;
    Promise.resolve(this.getCache()).then(() => {
      super.resize();
      this.resizing = false;
    });
  }

  getCache() {
    this.cache = [];
    this.dom.divs.forEach((el, index) => {
      el.style.transform = 'none';
      const scrollY = this.vars.target;
      const bounding = el.getBoundingClientRect();
      const bounds = {
        el: el,
        top: bounding.top + scrollY,
        speed: el.getAttribute('data-scroll-speed') || null,
      };
      this.cache.push(bounds);
    });
  }

  observe() {
    this.dom.divs.forEach((el, index) => {
      this.observer.observe(el);
    });
  }

  buildThresholdList() {
    let thresholds = [];
    let numSteps = 20;

    for (let i = 1.0; i <= numSteps; i++) {
      let ratio = i / numSteps;
      thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
  }

  handleObserve = (entries) => {
    entries.forEach((el, index) => {
      const { target, isIntersecting, intersectionRatio } = el;
      const revealed = target.getAttribute('data-inview');
      if (intersectionRatio > 0 && isIntersecting) {
        target.setAttribute('data-scroll', true);
      } else {
        target.setAttribute('data-scroll', false);
      }
      if (revealed === 'false') {
        if (intersectionRatio > 0.2) {
          target.setAttribute('data-inview', true);
        }
      }
    });
  };

  run() {
    this.dom.divs.forEach(this.inViewport);
    this.dom.section.style[this.prefix] = this.getTransform(this.vars.current * -1);
    if (!this.resizing) {
      this.cb && this.cb();
    }
    super.run();
  }

  inViewport(el, index) {
    if (!this.cache || this.resizing) return;
    const cache = this.cache[index];
    const current = this.vars.current;
    if (cache.speed) {
      const transform = (cache.top - current) * (cache.speed / 10);
      const inview = el.getAttribute('data-scroll');
      if (inview) {
        el.style[this.prefix] = this.getTransform(transform);
      }
    }
  }
}

export default Custom;
