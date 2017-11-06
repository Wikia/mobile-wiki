define('mobile-wiki/initializers/viewport-config', ['exports', 'mobile-wiki/config/environment', 'ember-in-viewport/utils/can-use-dom'], function (exports, _environment, _canUseDom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;


  var defaultConfig = {
    viewportEnabled: true,
    viewportSpy: false,
    viewportScrollSensitivity: 1,
    viewportRefreshRate: 100,
    viewportListeners: [{ context: window, event: 'scroll.scrollable' }, { context: window, event: 'resize.resizable' }],
    viewportTolerance: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  };

  if (_canUseDom.default) {
    defaultConfig.viewportListeners.push({
      context: document,
      event: 'touchmove.scrollable'
    });
  }

  var assign = Ember.assign || Ember.merge;

  function initialize() {
    var application = arguments[1] || arguments[0];
    var _config$viewportConfi = _environment.default.viewportConfig,
        viewportConfig = _config$viewportConfi === undefined ? {} : _config$viewportConfi;

    var mergedConfig = assign({}, defaultConfig, viewportConfig);

    application.register('config:in-viewport', mergedConfig, { instantiate: false });
  }

  exports.default = {
    name: 'viewport-config',
    initialize: initialize
  };
});