define('lodash/dropRight', ['exports', 'lodash/_baseSlice', 'lodash/toInteger'], function (exports, _baseSlice, _toInteger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a slice of `array` with `n` elements dropped from the end.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to query.
   * @param {number} [n=1] The number of elements to drop.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.dropRight([1, 2, 3]);
   * // => [1, 2]
   *
   * _.dropRight([1, 2, 3], 2);
   * // => [1]
   *
   * _.dropRight([1, 2, 3], 5);
   * // => []
   *
   * _.dropRight([1, 2, 3], 0);
   * // => [1, 2, 3]
   */
  function dropRight(array, n, guard) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    n = guard || n === undefined ? 1 : (0, _toInteger.default)(n);
    n = length - n;
    return (0, _baseSlice.default)(array, 0, n < 0 ? 0 : n);
  }

  exports.default = dropRight;
});