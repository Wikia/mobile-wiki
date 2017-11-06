define('lodash/entries', ['exports', 'lodash/toPairs'], function (exports, _toPairs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _toPairs.default;
    }
  });
});