define('lodash/sortedUniq', ['exports', 'lodash/_baseSortedUniq'], function (exports, _baseSortedUniq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.uniq` except that it's designed and optimized
   * for sorted arrays.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @returns {Array} Returns the new duplicate free array.
   * @example
   *
   * _.sortedUniq([1, 1, 2]);
   * // => [1, 2]
   */
  function sortedUniq(array) {
    return array && array.length ? (0, _baseSortedUniq.default)(array) : [];
  }

  exports.default = sortedUniq;
});