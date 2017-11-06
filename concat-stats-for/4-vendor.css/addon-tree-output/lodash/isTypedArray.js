define('lodash/isTypedArray', ['exports', 'lodash/_baseIsTypedArray', 'lodash/_baseUnary', 'lodash/_nodeUtil'], function (exports, _baseIsTypedArray, _baseUnary, _nodeUtil) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Node helper references. */
  var nodeIsTypedArray = _nodeUtil.default && _nodeUtil.default.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? (0, _baseUnary.default)(nodeIsTypedArray) : _baseIsTypedArray.default;

  exports.default = isTypedArray;
});