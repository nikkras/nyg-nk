const settings = {};

// cms url data
settings.cms = `${process.env.REACT_APP_CMS_URL}`;

// global
settings.resizeDebounceTime = 10; // in ms
settings.isDevelopment = process.env.NODE_ENV !== 'production';

// global paths
settings.assetPath = `${process.env.PUBLIC_URL}/assets/`;
settings.imagesPath = `${process.env.PUBLIC_URL}/assets/images/`;

export default settings;
