define('lodash/reject', ['exports', 'lodash/_arrayFilter', 'lodash/_baseFilter', 'lodash/_baseIteratee', 'lodash/isArray', 'lodash/negate'], function (exports, _arrayFilter, _baseFilter, _baseIteratee, _isArray, _negate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The opposite of `_.filter`; this method returns the elements of `collection`
   * that `predicate` does **not** return truthy for.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   * @see _.filter
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': false },
   *   { 'user': 'fred',   'age': 40, 'active': true }
   * ];
   *
   * _.reject(users, function(o) { return !o.active; });
   * // => objects for ['fred']
   *
   * // The `_.matches` iteratee shorthand.
   * _.reject(users, { 'age': 40, 'active': true });
   * // => objects for ['barney']
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.reject(users, ['active', false]);
   * // => objects for ['fred']
   *
   * // The `_.property` iteratee shorthand.
   * _.reject(users, 'active');
   * // => objects for ['barney']
   */
  function reject(collection, predicate) {
    var func = (0, _isArray.default)(collection) ? _arrayFilter.default : _baseFilter.default;
    return func(collection, (0, _negate.default)((0, _baseIteratee.default)(predicate, 3)));
  }

  exports.default = reject;
});