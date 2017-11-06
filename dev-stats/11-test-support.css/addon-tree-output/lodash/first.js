define('lodash/first', ['exports', 'lodash/head'], function (exports, _head) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _head.default;
    }
  });
});