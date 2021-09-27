const helpers = (function() {
  const observer = (function() {
    const listeners = {};

    function isValidEventListener(event) {
      return listeners[event] instanceof Array;
    }

    function listen(event, fn) {
      if (!isValidEventListener(event)) listeners[event] = []; 

      listeners[event].push(fn);
    }

    function dispatch(event, data) {
      let success = true;

      if (isValidEventListener(event)) {
        listeners[event].forEach(fn => fn(data));
      } else {
        success = false;
      }

      return success;
    }

    return {
      listen,
      dispatch,
    }
  })()

  return {
    observer,
  }
})();
