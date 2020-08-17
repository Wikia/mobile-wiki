(function () {
  var callbacksQueue = [];
  var isListening = false;
  var eventDispatched = false;
  var eventName = 'asyncScriptsLoaded';

  window.onAsyncScriptsLoaded = function () {
    eventDispatched = true;
    window.document.dispatchEvent(new Event(eventName));
  };

  window.onAsyncScriptsError = function () {
    eventDispatched = true;
    window.Wikia = window.Wikia || {};
    window.document.dispatchEvent(new Event(eventName));
  };

  function onAsyncScriptsLoaded() {
    callbacksQueue.forEach(function (callback) {
      callback();
    });

    callbacksQueue = [];
  }

  function waitForAsyncScripts() {
    if (eventDispatched) {
      onAsyncScriptsLoaded();
      return;
    }

    if (!isListening) {
      document.addEventListener(eventName, onAsyncScriptsLoaded, { once: true });
      isListening = true;
    }
  }

  window.onABTestLoaded = function (callback) {
    if (window.Wikia && window.Wikia.AbTest) {
      callback();
    } else {
      callbacksQueue.push(callback);
      waitForAsyncScripts();
    }
  };
}());
