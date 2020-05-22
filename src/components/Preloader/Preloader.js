import React from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';
import PropTypes from 'prop-types';
import preloader from 'preloader';
import { device } from '@jam3/detect';
import noop from 'no-op';
// import wait from '@jam3/wait';
import checkProps from '@jam3/react-check-extra-props';
import { gsap } from 'gsap';
import sanitizer from '../../util/sanitizer';
// import settings from '../../data/settings';
// import routePages from '../../routes/pages';

// import backupData from '../../data/backup-data';

import './Preloader.scss';

import { ReactComponent as LoaderIcon } from '../../assets/svg/loader.svg';

import { setProgress, setReady, setSiteData } from '../../redux/modules/preloader';
import preloadAssets from '../../data/preload-assets';

class Preloader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      heroAssets: [],
    };
    this.tl = gsap.timeline();
  }

  async componentDidMount() {
    await Promise.all([this.animateIn(), this.setData(), this.setLoader()]);
    // await Promise.all([this.setTimer(), this.setLoader()]);
    this.setDone();
  }

  animateIn() {
    return new Promise((resolve) => {
      this.tl
        .to(this.container, 0.4, { autoAlpha: 1, onComplete: resolve })
        .to(this.progressBar, 0.4, { autoAlpha: 1 })
        .to(this.progressTxt, 0.4, { autoAlpha: 1, onComplete: resolve });
    });
  }

  animateOut() {
    return new Promise((resolve) => {
      this.tl.to(this.container, 0.4, { autoAlpha: 0, onComplete: resolve });
    });
  }

  // async setTimer() {
  //   return await wait(this.props.minDisplayTime);
  // }

  async setData() {
    // const fetchedData = { test: 'asfg' };
    // const heroAssets = [];
    // const pages = `${settings.cms}pages?per_page=16`;
    // const posts = `${settings.cms}posts`;
    // const reqPages = axios.get(pages);
    // const reqPosts = axios.get(posts);
    // await axios.all([reqPages, reqPosts]).then(
    //   axios.spread((...responses) => {
    //     const responsePages = responses[0].data;
    //     const responsePosts = responses[1];
    //     routePages.forEach(pageName => {
    //       const pageData = responsePages.filter(page => page.slug === pageName);
    //       if (pageData[0]) {
    //         fetchedData[pageData[0].slug] = pageData[0];
    //       }
    //     });
    //     fetchedData.posts = responsePosts;
    //     this.addAssets(fetchedData.homepage.acf.immagine_jue, heroAssets);
    //     this.addAssets(fetchedData.jue.acf.hero_slider[0], heroAssets);
    //     this.addAssets(fetchedData.eventi.acf.hero, heroAssets);
    //     this.props.setSiteData(fetchedData);
    //   })
    // );
  }

  addAssets = (img, heroAssets) => {
    if (img) {
      if (Array.isArray(img)) {
        img.forEach((el) => {
          if (device.isMobile) {
            heroAssets.push(el.sizes.large);
          } else {
            heroAssets.push(el.url);
          }
          this.setState({
            heroAssets: heroAssets,
          });
        });
      } else {
        if (device.isMobile) {
          heroAssets.push(img.sizes.large);
        } else {
          heroAssets.push(img.url);
        }
        this.setState({
          heroAssets: heroAssets,
        });
      }
    }
  };

  setLoader() {
    return new Promise((resolve, reject) => {
      this.loader = preloader(this.props.options);
      this.props.assets.forEach((file) => this.add(file));
      this.state.heroAssets.forEach((file) => this.add(file));
      this.loader.on('progress', this.onProgress);
      this.loader.on('complete', () => this.onComplete(resolve));
      this.load();
    });
  }

  add(url, options = {}) {
    this.loader.add(url, options);
  }

  load() {
    this.loader.load();
  }

  onProgress = (val) => {
    this.progressTxt.children[0].innerText = `${Math.round(val * 100)}%`;
    this.progressBar_progress.style.width = `${Math.round(val * 100)}%`;
    this.props.setProgress(val);
  };

  onComplete = (done) => {
    this.props.setProgress(1);
    done();
  };

  setDone = async () => {
    await this.animateOut();
    this.props.setReady(true);
  };

  render() {
    return (
      <section id="Preloader" ref={(r) => (this.container = r)}>
        <div className="Preloader__icon">
          <LoaderIcon className="loader-icon" />
        </div>
        <div className="Preloader__bar" ref={(r) => (this.progressBar = r)}>
          <span ref={(r) => (this.progressBar_progress = r)} />
        </div>
        <div className="Preloader__txt" ref={(r) => (this.progressTxt = r)}>
          <span>{sanitizer('0%')}</span>
        </div>
      </section>
    );
  }
}

Preloader.propTypes = checkProps({
  className: PropTypes.string,
  assets: PropTypes.array.isRequired,
  setProgress: PropTypes.func.isRequired,
  setReady: PropTypes.func.isRequired,
  minDisplayTime: PropTypes.number,
  options: PropTypes.object,
  progress: PropTypes.number,
  transitionState: PropTypes.string,
  siteData: PropTypes.object.isRequired,
  setSiteData: PropTypes.func.isRequired,
});

Preloader.defaultProps = {
  className: '',
  assets: [],
  minDisplayTime: 300, // in milliseconds
  options: {
    xhrImages: false,
    loadFullAudio: false,
    loadFullVideo: false,
    onProgress: noop,
    onComplete: noop,
  },
};

const mapStateToProps = (state, ownProps) => {
  return {
    progress: state.preloader.progress,
    assets: preloadAssets,
    siteData: state.siteData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setProgress: (val) => dispatch(setProgress(val)),
    setReady: (val) => dispatch(setReady(val)),
    setSiteData: (val) => dispatch(setSiteData(val)),
  };
};

// export default connect(mapStateToProps, mapDispatchToProps, undefined, { forwardRef: true })(Preloader);
export default connect(mapStateToProps, mapDispatchToProps)(Preloader);
