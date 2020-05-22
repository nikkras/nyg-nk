import routeKeys from '../routes/keys';
import logo from '../assets/images/logo.png';

export default {
  logoSrc: logo,
  links: [
    {
      text: 'Home',
      path: routeKeys.Landing,
    },
    {
      text: 'About',
      path: routeKeys.About,
    },
  ],
};
