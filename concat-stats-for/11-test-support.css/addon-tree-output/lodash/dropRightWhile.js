define('lodash/dropRightWhile', ['exports', 'lodash/_baseIteratee', 'lodash/_baseWhile'], function (exports, _baseIteratee, _baseWhile) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a slice of `array` excluding elements dropped from the end.
   * Elements are dropped until `predicate` returns falsey. The predicate is
   * invoked with three arguments: (value, index, array).
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to query.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': true },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': false }
   * ];
   *
   * _.dropRightWhile(users, function(o) { return !o.active; });
   * // => objects for ['barney']
   *
   * // The `_.matches` iteratee shorthand.
   * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
   * // => objects for ['barney', 'fred']
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.dropRightWhile(users, ['active', false]);
   * // => objects for ['barney']
   *
   * // The `_.property` iteratee shorthand.
   * _.dropRightWhile(users, 'active');
   * // => objects for ['barney', 'fred', 'pebbles']
   */
  function dropRightWhile(array, predicate) {
    return array && array.length ? (0, _baseWhile.default)(array, (0, _baseIteratee.default)(predicate, 3), true, true) : [];
  }

  exports.default = dropRightWhile;
});