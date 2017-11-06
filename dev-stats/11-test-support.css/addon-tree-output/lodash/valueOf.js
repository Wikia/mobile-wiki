define('lodash/valueOf', ['exports', 'lodash/wrapperValue'], function (exports, _wrapperValue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _wrapperValue.default;
    }
  });
});