import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import { device } from '@jam3/detect';
// import { BaseLink } from '@jam3/react-ui';
import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';
import animate from 'gsap';
import classes from 'dom-classes';
import select from 'dom-select';
import sanitazer from '../../util/sanitizer';
import Smooth from '../../lib/smooth/smooth';

import './Landing.scss';
import 'smooth-scrolling/demos/main.css';

import Transition from '../PagesTransitionWrapper';
import { setLandingLoaded } from '../../redux/modules/landing';

class Landing extends React.PureComponent {
  constructor(props) {
    super(props);
    this.initSmoothScrollDebounced = debounce(this.initSmoothScroll, 400);
  }

  componentDidMount() {
    this.footer = select('footer.Footer');
    this.main = select('main');
    this.body = select('body');
    this.header = select('header.MainTopNav');
    animate.set(this.main, { clearProps: 'all' });
    if (!this.props.loaded) {
      // await for data to be loaded here e.g. via fetch
      this.props.setLandingLoaded(true);
    }
    if (!device.isMobile) {
      this.initSmoothScrollDebounced();
    }
  }

  onAppear = () => {
    this.animateIn();
  };

  onEnter = async (prevSectionExitDuration) => {
    await wait(prevSectionExitDuration); // you need to remove this if you want to perform simultaneous transition
    classes.remove(this.body, 'changePage');
    this.animateIn();
  };

  onLeave = () => {
    this.animateOut();
  };

  animateIn = () => {
    animate.to(this.header, 0.3, { autoAlpha: 1, delay: 0.5 });
    animate.to(this.footer, 0.3, { autoAlpha: 1, delay: 0.5 });
    animate.to(this.container, 0.3, { autoAlpha: 1, delay: 0.5 });
  };

  animateOut = () => {
    // Note that the total duration should match `exit` duration for the page inside `data/pages-transitions`
    classes.add(this.body, 'changePage');
    animate.to(this.header, 0.3, { autoAlpha: 0 });
    animate.to(this.footer, 0.3, { autoAlpha: 0 });
    animate.to(this.container, 0.3, { autoAlpha: 0 }).then(() => {
      if (typeof this.scroll !== 'undefined') {
        this.destroySmoothScroll();
      }
    });
  };

  initSmoothScroll = () => {
    const divs = this.domSmooth.filter((el) => {
      return el != null;
    });
    this.scroll = new Smooth({
      section: this.main,
      divs: divs,
      footer: this.footer,
      preload: true,
      vs: {
        mouseMultiplier: 0.4,
        touchMultiplier: 2,
        firefoxMultiplier: 50,
      },
      // cb: this.scrollEvents ? this.scrollEvents : null,
    });
    this.scroll.init();
  };

  destroySmoothScroll = () => {
    this.main.style.transform = null;
    this.domSmooth = [];
    this.scroll.destroy();
  };

  render() {
    this.domSmooth = [];
    // const props = this.props;
    return (
      <section className={classnames('Landing', this.props.className)} ref={(el) => (this.container = el)}>
        <header className="Landing-header" ref={(el) => this.domSmooth.push(el)}>
          <h1 className="Landing-title">{sanitazer('wooaa')}</h1>
        </header>
        <section className="Landing-intro" data-inview="false" ref={(el) => this.domSmooth.push(el)}>
          <p>
            {sanitazer(
              'Veniam esse sint culpa Lorem amet nulla et amet nulla ex et irure dolor. Consequat veniam velit magna pariatur dolor cupidatat aute labore voluptate. Qui nulla laborum velit do nostrud incididunt qui commodo quis sunt non.'
            )}
          </p>
        </section>
      </section>
    );
  }
}

Landing.propTypes = checkProps({
  className: PropTypes.string,
  transitionState: PropTypes.string.isRequired,
  previousRoute: PropTypes.string,
  loaded: PropTypes.bool,
  setLandingLoaded: PropTypes.func,
});

Landing.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
  return {
    previousRoute: state.previousRoute,
    loaded: state.landingLoaded.loaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLandingLoaded: (val) => dispatch(setLandingLoaded(val)),
  };
};

Landing.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Transition(Landing));
