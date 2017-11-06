define('lodash/_baseIsEqual', ['exports', 'lodash/_baseIsEqualDeep', 'lodash/isObjectLike'], function (exports, _baseIsEqualDeep, _isObjectLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !(0, _isObjectLike.default)(value) && !(0, _isObjectLike.default)(other)) {
      return value !== value && other !== other;
    }
    return (0, _baseIsEqualDeep.default)(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  exports.default = baseIsEqual;
});