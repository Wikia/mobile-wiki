define('ember-cli-app-version/initializer-factory', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = initializerFactory;
  var classify = Ember.String.classify,
      libraries = Ember.libraries;
  function initializerFactory(name, version) {
    var registered = false;

    return function () {
      if (!registered && name && version) {
        var appName = classify(name);
        libraries.register(appName, version);
        registered = true;
      }
    };
  }
});