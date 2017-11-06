define('mobile-wiki/initializers/app-scheduler', ['exports', 'ember-app-scheduler/initializers/app-scheduler'], function (exports, _appScheduler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _appScheduler.default;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _appScheduler.initialize;
    }
  });
});