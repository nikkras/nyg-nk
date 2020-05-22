export default (delay, func) => {
  setTimeout(() => {
    if (typeof Event === 'function') {
      window.dispatchEvent(new Event('resize'));
      if (func) func();
    } else {
      var evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(evt);
      if (func) func();
    }
  }, delay);
};
