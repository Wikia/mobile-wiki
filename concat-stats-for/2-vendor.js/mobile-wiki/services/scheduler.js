define('mobile-wiki/services/scheduler', ['exports', 'ember-app-scheduler/services/scheduler'], function (exports, _scheduler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _scheduler.default;
    }
  });
});