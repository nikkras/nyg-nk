import keys from '../keys';

const defaultState = {
  preloader: {
    progress: 0,
    ready: false,
  },
  data: {},
};

// Reducer
export function preloaderReducer(state = defaultState.preloader, action) {
  switch (action.type) {
    case keys.SET_PROGRESS:
      return {
        ...state,
        progress: action.progress,
      };
    case keys.SET_READY:
      return {
        ...state,
        ready: action.ready,
      };
    default:
      return state;
  }
}

export function siteDataReducer(state = defaultState.data, action) {
  switch (action.type) {
    case keys.SET_SITE_DATA:
      return action.siteData;
    default:
      return state;
  }
}

// Action Creators
export function setReady(ready) {
  return {
    type: keys.SET_READY,
    ready,
  };
}

export function setProgress(progress) {
  return {
    type: keys.SET_PROGRESS,
    progress,
  };
}

export function setSiteData(siteData) {
  return {
    type: keys.SET_SITE_DATA,
    siteData,
  };
}
