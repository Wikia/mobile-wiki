define('lodash/_baseMergeDeep', ['exports', 'lodash/_assignMergeValue', 'lodash/_cloneBuffer', 'lodash/_cloneTypedArray', 'lodash/_copyArray', 'lodash/_initCloneObject', 'lodash/isArguments', 'lodash/isArray', 'lodash/isArrayLikeObject', 'lodash/isBuffer', 'lodash/isFunction', 'lodash/isObject', 'lodash/isPlainObject', 'lodash/isTypedArray', 'lodash/toPlainObject'], function (exports, _assignMergeValue, _cloneBuffer, _cloneTypedArray, _copyArray, _initCloneObject, _isArguments, _isArray, _isArrayLikeObject, _isBuffer, _isFunction, _isObject, _isPlainObject, _isTypedArray, _toPlainObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = object[key],
        srcValue = source[key],
        stacked = stack.get(srcValue);

    if (stacked) {
      (0, _assignMergeValue.default)(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;

    var isCommon = newValue === undefined;

    if (isCommon) {
      var isArr = (0, _isArray.default)(srcValue),
          isBuff = !isArr && (0, _isBuffer.default)(srcValue),
          isTyped = !isArr && !isBuff && (0, _isTypedArray.default)(srcValue);

      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if ((0, _isArray.default)(objValue)) {
          newValue = objValue;
        } else if ((0, _isArrayLikeObject.default)(objValue)) {
          newValue = (0, _copyArray.default)(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = (0, _cloneBuffer.default)(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = (0, _cloneTypedArray.default)(srcValue, true);
        } else {
          newValue = [];
        }
      } else if ((0, _isPlainObject.default)(srcValue) || (0, _isArguments.default)(srcValue)) {
        newValue = objValue;
        if ((0, _isArguments.default)(objValue)) {
          newValue = (0, _toPlainObject.default)(objValue);
        } else if (!(0, _isObject.default)(objValue) || srcIndex && (0, _isFunction.default)(objValue)) {
          newValue = (0, _initCloneObject.default)(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack['delete'](srcValue);
    }
    (0, _assignMergeValue.default)(object, key, newValue);
  }

  exports.default = baseMergeDeep;
});