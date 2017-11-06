define('mobile-wiki/instance-initializers/init-app-scheduler', ['exports', 'ember-app-scheduler/instance-initializers/init-app-scheduler'], function (exports, _initAppScheduler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _initAppScheduler.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _initAppScheduler.initialize;
    }
  });
});