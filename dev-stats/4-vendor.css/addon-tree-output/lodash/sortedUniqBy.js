define('lodash/sortedUniqBy', ['exports', 'lodash/_baseIteratee', 'lodash/_baseSortedUniq'], function (exports, _baseIteratee, _baseSortedUniq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.uniqBy` except that it's designed and optimized
   * for sorted arrays.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @returns {Array} Returns the new duplicate free array.
   * @example
   *
   * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
   * // => [1.1, 2.3]
   */
  function sortedUniqBy(array, iteratee) {
    return array && array.length ? (0, _baseSortedUniq.default)(array, (0, _baseIteratee.default)(iteratee, 2)) : [];
  }

  exports.default = sortedUniqBy;
});