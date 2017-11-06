define('lodash/_arraySampleSize', ['exports', 'lodash/_baseClamp', 'lodash/_copyArray', 'lodash/_shuffleSelf'], function (exports, _baseClamp, _copyArray, _shuffleSelf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * A specialized version of `_.sampleSize` for arrays.
   *
   * @private
   * @param {Array} array The array to sample.
   * @param {number} n The number of elements to sample.
   * @returns {Array} Returns the random elements.
   */
  function arraySampleSize(array, n) {
    return (0, _shuffleSelf.default)((0, _copyArray.default)(array), (0, _baseClamp.default)(n, 0, array.length));
  }

  exports.default = arraySampleSize;
});