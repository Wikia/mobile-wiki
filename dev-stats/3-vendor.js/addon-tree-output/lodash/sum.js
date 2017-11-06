define('lodash/sum', ['exports', 'lodash/_baseSum', 'lodash/identity'], function (exports, _baseSum, _identity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Computes the sum of the values in `array`.
   *
   * @static
   * @memberOf _
   * @since 3.4.0
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {number} Returns the sum.
   * @example
   *
   * _.sum([4, 2, 8, 6]);
   * // => 20
   */
  function sum(array) {
    return array && array.length ? (0, _baseSum.default)(array, _identity.default) : 0;
  }

  exports.default = sum;
});