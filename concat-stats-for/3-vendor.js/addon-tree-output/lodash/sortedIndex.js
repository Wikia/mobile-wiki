define('lodash/sortedIndex', ['exports', 'lodash/_baseSortedIndex'], function (exports, _baseSortedIndex) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Uses a binary search to determine the lowest index at which `value`
   * should be inserted into `array` in order to maintain its sort order.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The sorted array to inspect.
   * @param {*} value The value to evaluate.
   * @returns {number} Returns the index at which `value` should be inserted
   *  into `array`.
   * @example
   *
   * _.sortedIndex([30, 50], 40);
   * // => 1
   */
  function sortedIndex(array, value) {
    return (0, _baseSortedIndex.default)(array, value);
  }

  exports.default = sortedIndex;
});