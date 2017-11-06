define('lodash/number.default', ['exports', 'lodash/clamp', 'lodash/inRange', 'lodash/random'], function (exports, _clamp, _inRange, _random) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    clamp: _clamp.default, inRange: _inRange.default, random: _random.default
  };
});