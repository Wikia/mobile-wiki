define('lodash/omitBy', ['exports', 'lodash/_baseIteratee', 'lodash/negate', 'lodash/pickBy'], function (exports, _baseIteratee, _negate, _pickBy) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The opposite of `_.pickBy`; this method creates an object composed of
   * the own and inherited enumerable string keyed properties of `object` that
   * `predicate` doesn't return truthy for. The predicate is invoked with two
   * arguments: (value, key).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The source object.
   * @param {Function} [predicate=_.identity] The function invoked per property.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.omitBy(object, _.isNumber);
   * // => { 'b': '2' }
   */
  function omitBy(object, predicate) {
    return (0, _pickBy.default)(object, (0, _negate.default)((0, _baseIteratee.default)(predicate)));
  }

  exports.default = omitBy;
});