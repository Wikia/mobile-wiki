define('lodash/date', ['exports', 'lodash/now', 'lodash/date.default'], function (exports, _now, _date) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'now', {
    enumerable: true,
    get: function () {
      return _now.default;
    }
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _date.default;
    }
  });
});