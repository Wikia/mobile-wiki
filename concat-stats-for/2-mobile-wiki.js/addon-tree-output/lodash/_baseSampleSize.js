define('lodash/_baseSampleSize', ['exports', 'lodash/_baseClamp', 'lodash/_shuffleSelf', 'lodash/values'], function (exports, _baseClamp, _shuffleSelf, _values) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.sampleSize` without param guards.
   *
   * @private
   * @param {Array|Object} collection The collection to sample.
   * @param {number} n The number of elements to sample.
   * @returns {Array} Returns the random elements.
   */
  function baseSampleSize(collection, n) {
    var array = (0, _values.default)(collection);
    return (0, _shuffleSelf.default)(array, (0, _baseClamp.default)(n, 0, array.length));
  }

  exports.default = baseSampleSize;
});