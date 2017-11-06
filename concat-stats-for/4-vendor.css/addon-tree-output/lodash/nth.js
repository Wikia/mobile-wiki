define('lodash/nth', ['exports', 'lodash/_baseNth', 'lodash/toInteger'], function (exports, _baseNth, _toInteger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the element at index `n` of `array`. If `n` is negative, the nth
   * element from the end is returned.
   *
   * @static
   * @memberOf _
   * @since 4.11.0
   * @category Array
   * @param {Array} array The array to query.
   * @param {number} [n=0] The index of the element to return.
   * @returns {*} Returns the nth element of `array`.
   * @example
   *
   * var array = ['a', 'b', 'c', 'd'];
   *
   * _.nth(array, 1);
   * // => 'b'
   *
   * _.nth(array, -2);
   * // => 'c';
   */
  function nth(array, n) {
    return array && array.length ? (0, _baseNth.default)(array, (0, _toInteger.default)(n)) : undefined;
  }

  exports.default = nth;
});