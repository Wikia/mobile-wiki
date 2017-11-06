define('lodash/pickBy', ['exports', 'lodash/_arrayMap', 'lodash/_baseIteratee', 'lodash/_basePickBy', 'lodash/_getAllKeysIn'], function (exports, _arrayMap, _baseIteratee, _basePickBy, _getAllKeysIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an object composed of the `object` properties `predicate` returns
   * truthy for. The predicate is invoked with two arguments: (value, key).
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
   * _.pickBy(object, _.isNumber);
   * // => { 'a': 1, 'c': 3 }
   */
  function pickBy(object, predicate) {
    if (object == null) {
      return {};
    }
    var props = (0, _arrayMap.default)((0, _getAllKeysIn.default)(object), function (prop) {
      return [prop];
    });
    predicate = (0, _baseIteratee.default)(predicate);
    return (0, _basePickBy.default)(object, props, function (value, path) {
      return predicate(value, path[0]);
    });
  }

  exports.default = pickBy;
});