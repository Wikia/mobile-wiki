define('mobile-wiki/initializers/ember-cli-mirage', ['exports', 'ember-cli-mirage/utils/read-modules', 'mobile-wiki/config/environment', 'mobile-wiki/mirage/config', 'ember-cli-mirage/server', 'lodash/assign'], function (exports, _readModules, _environment, _config, _server, _assign2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.startMirage = startMirage;
  var getWithDefault = Ember.getWithDefault;
  exports.default = {
    name: 'ember-cli-mirage',
    initialize: function initialize(application) {
      if (arguments.length > 1) {
        // Ember < 2.1
        var container = arguments[0],
            application = arguments[1];
      }

      if (_shouldUseMirage(_environment.default.environment, _environment.default['ember-cli-mirage'])) {
        startMirage(_environment.default);
      }
    }
  };
  function startMirage() {
    var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _environment.default;

    var environment = env.environment;
    var discoverEmberDataModels = getWithDefault(env['ember-cli-mirage'] || {}, 'discoverEmberDataModels', true);
    var modules = (0, _readModules.default)(env.modulePrefix);
    var options = (0, _assign2.default)(modules, { environment: environment, baseConfig: _config.default, testConfig: _config.testConfig, discoverEmberDataModels: discoverEmberDataModels });

    return new _server.default(options);
  }

  function _shouldUseMirage(env, addonConfig) {
    if (typeof FastBoot !== 'undefined') {
      return false;
    }
    var userDeclaredEnabled = typeof addonConfig.enabled !== 'undefined';
    var defaultEnabled = _defaultEnabled(env, addonConfig);

    return userDeclaredEnabled ? addonConfig.enabled : defaultEnabled;
  }

  /*
    Returns a boolean specifying the default behavior for whether
    to initialize Mirage.
  */
  function _defaultEnabled(env, addonConfig) {
    var usingInDev = env === 'development' && !addonConfig.usingProxy;
    var usingInTest = env === 'test';

    return usingInDev || usingInTest;
  }
});