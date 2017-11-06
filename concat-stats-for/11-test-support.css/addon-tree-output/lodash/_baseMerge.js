define('lodash/_baseMerge', ['exports', 'lodash/_Stack', 'lodash/_assignMergeValue', 'lodash/_baseFor', 'lodash/_baseMergeDeep', 'lodash/isObject', 'lodash/keysIn'], function (exports, _Stack, _assignMergeValue, _baseFor, _baseMergeDeep, _isObject, _keysIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.merge` without support for multiple sources.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {number} srcIndex The index of `source`.
   * @param {Function} [customizer] The function to customize merged values.
   * @param {Object} [stack] Tracks traversed source values and their merged
   *  counterparts.
   */
  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    (0, _baseFor.default)(source, function (srcValue, key) {
      if ((0, _isObject.default)(srcValue)) {
        stack || (stack = new _Stack.default());
        (0, _baseMergeDeep.default)(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(object[key], srcValue, key + '', object, source, stack) : undefined;

        if (newValue === undefined) {
          newValue = srcValue;
        }
        (0, _assignMergeValue.default)(object, key, newValue);
      }
    }, _keysIn.default);
  }

  exports.default = baseMerge;
});