import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import { device } from '@jam3/detect';
import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';
import classes from 'dom-classes';
import animate from 'gsap';
import select from 'dom-select';
import Smooth from '../../lib/smooth/smooth';

import './About.scss';
import 'smooth-scrolling/demos/main.css';

import Transition from '../PagesTransitionWrapper';
import PrefetchLink from '../../components/PrefetchLink/PrefetchLink';
import routeKeys from '../../routes/keys';

class About extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.initSmoothScrollDebounced = debounce(this.initSmoothScroll, 400);
  }

  componentDidMount() {
    this.footer = select('footer.Footer');
    this.main = select('main');
    this.body = select('body');
    this.header = select('header.MainTopNav');
    animate.set(this.main, { clearProps: 'all' });
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
      <section className={classnames('About', this.props.className)} ref={(el) => (this.container = el)}>
        <h1 ref={(el) => this.domSmooth.push(el)}>About</h1>
        <PrefetchLink link={routeKeys.Landing}>Home</PrefetchLink>
      </section>
    );
  }
}

About.propTypes = checkProps({
  className: PropTypes.string,
  transitionState: PropTypes.string.isRequired,
  previousRoute: PropTypes.string,
  pageData: PropTypes.object,
});

About.defaultProps = {};

const mapStateToProps = (state) => ({
  previousRoute: state.previousRoute,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Transition(About));
