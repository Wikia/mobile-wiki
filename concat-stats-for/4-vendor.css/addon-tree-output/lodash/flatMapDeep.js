define('lodash/flatMapDeep', ['exports', 'lodash/_baseFlatten', 'lodash/map'], function (exports, _baseFlatten, _map) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /**
   * This method is like `_.flatMap` except that it recursively flattens the
   * mapped results.
   *
   * @static
   * @memberOf _
   * @since 4.7.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * function duplicate(n) {
   *   return [[[n, n]]];
   * }
   *
   * _.flatMapDeep([1, 2], duplicate);
   * // => [1, 1, 2, 2]
   */
  function flatMapDeep(collection, iteratee) {
    return (0, _baseFlatten.default)((0, _map.default)(collection, iteratee), INFINITY);
  }

  exports.default = flatMapDeep;
});