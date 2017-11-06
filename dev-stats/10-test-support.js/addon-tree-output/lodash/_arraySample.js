define('lodash/_arraySample', ['exports', 'lodash/_baseRandom'], function (exports, _baseRandom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * A specialized version of `_.sample` for arrays.
   *
   * @private
   * @param {Array} array The array to sample.
   * @returns {*} Returns the random element.
   */
  function arraySample(array) {
    var length = array.length;
    return length ? array[(0, _baseRandom.default)(0, length - 1)] : undefined;
  }

  exports.default = arraySample;
});