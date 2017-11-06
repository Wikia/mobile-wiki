define('lodash/_baseMatchesProperty', ['exports', 'lodash/_baseIsEqual', 'lodash/get', 'lodash/hasIn', 'lodash/_isKey', 'lodash/_isStrictComparable', 'lodash/_matchesStrictComparable', 'lodash/_toKey'], function (exports, _baseIsEqual, _get, _hasIn, _isKey, _isStrictComparable, _matchesStrictComparable, _toKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if ((0, _isKey.default)(path) && (0, _isStrictComparable.default)(srcValue)) {
      return (0, _matchesStrictComparable.default)((0, _toKey.default)(path), srcValue);
    }
    return function (object) {
      var objValue = (0, _get.default)(object, path);
      return objValue === undefined && objValue === srcValue ? (0, _hasIn.default)(object, path) : (0, _baseIsEqual.default)(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }

  exports.default = baseMatchesProperty;
});