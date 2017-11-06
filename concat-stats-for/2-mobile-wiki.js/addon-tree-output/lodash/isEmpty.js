define('lodash/isEmpty', ['exports', 'lodash/_baseKeys', 'lodash/_getTag', 'lodash/isArguments', 'lodash/isArray', 'lodash/isArrayLike', 'lodash/isBuffer', 'lodash/_isPrototype', 'lodash/isTypedArray'], function (exports, _baseKeys, _getTag, _isArguments, _isArray, _isArrayLike, _isBuffer, _isPrototype, _isTypedArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var mapTag = '[object Map]',
      setTag = '[object Set]';

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Checks if `value` is an empty object, collection, map, or set.
   *
   * Objects are considered empty if they have no own enumerable string keyed
   * properties.
   *
   * Array-like values such as `arguments` objects, arrays, buffers, strings, or
   * jQuery-like collections are considered empty if they have a `length` of `0`.
   * Similarly, maps and sets are considered empty if they have a `size` of `0`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty(null);
   * // => true
   *
   * _.isEmpty(true);
   * // => true
   *
   * _.isEmpty(1);
   * // => true
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({ 'a': 1 });
   * // => false
   */
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    if ((0, _isArrayLike.default)(value) && ((0, _isArray.default)(value) || typeof value == 'string' || typeof value.splice == 'function' || (0, _isBuffer.default)(value) || (0, _isTypedArray.default)(value) || (0, _isArguments.default)(value))) {
      return !value.length;
    }
    var tag = (0, _getTag.default)(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
    if ((0, _isPrototype.default)(value)) {
      return !(0, _baseKeys.default)(value).length;
    }
    for (var key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  exports.default = isEmpty;
});