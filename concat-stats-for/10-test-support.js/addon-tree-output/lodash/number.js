define('lodash/number', ['exports', 'lodash/clamp', 'lodash/inRange', 'lodash/random', 'lodash/number.default'], function (exports, _clamp, _inRange, _random, _number) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'clamp', {
    enumerable: true,
    get: function () {
      return _clamp.default;
    }
  });
  Object.defineProperty(exports, 'inRange', {
    enumerable: true,
    get: function () {
      return _inRange.default;
    }
  });
  Object.defineProperty(exports, 'random', {
    enumerable: true,
    get: function () {
      return _random.default;
    }
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _number.default;
    }
  });
});