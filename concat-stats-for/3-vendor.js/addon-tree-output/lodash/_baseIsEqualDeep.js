define('lodash/_baseIsEqualDeep', ['exports', 'lodash/_Stack', 'lodash/_equalArrays', 'lodash/_equalByTag', 'lodash/_equalObjects', 'lodash/_getTag', 'lodash/isArray', 'lodash/isBuffer', 'lodash/isTypedArray'], function (exports, _Stack, _equalArrays, _equalByTag, _equalObjects, _getTag, _isArray, _isBuffer, _isTypedArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      objectTag = '[object Object]';

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = (0, _isArray.default)(object),
        othIsArr = (0, _isArray.default)(other),
        objTag = objIsArr ? arrayTag : (0, _getTag.default)(object),
        othTag = othIsArr ? arrayTag : (0, _getTag.default)(other);

    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;

    var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;

    if (isSameTag && (0, _isBuffer.default)(object)) {
      if (!(0, _isBuffer.default)(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new _Stack.default());
      return objIsArr || (0, _isTypedArray.default)(object) ? (0, _equalArrays.default)(object, other, bitmask, customizer, equalFunc, stack) : (0, _equalByTag.default)(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new _Stack.default());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new _Stack.default());
    return (0, _equalObjects.default)(object, other, bitmask, customizer, equalFunc, stack);
  }

  exports.default = baseIsEqualDeep;
});