define('lodash/isSet', ['exports', 'lodash/_baseIsSet', 'lodash/_baseUnary', 'lodash/_nodeUtil'], function (exports, _baseIsSet, _baseUnary, _nodeUtil) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Node helper references. */
  var nodeIsSet = _nodeUtil.default && _nodeUtil.default.isSet;

  /**
   * Checks if `value` is classified as a `Set` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   * @example
   *
   * _.isSet(new Set);
   * // => true
   *
   * _.isSet(new WeakSet);
   * // => false
   */
  var isSet = nodeIsSet ? (0, _baseUnary.default)(nodeIsSet) : _baseIsSet.default;

  exports.default = isSet;
});