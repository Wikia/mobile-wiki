define('lodash/isArrayBuffer', ['exports', 'lodash/_baseIsArrayBuffer', 'lodash/_baseUnary', 'lodash/_nodeUtil'], function (exports, _baseIsArrayBuffer, _baseUnary, _nodeUtil) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Node helper references. */
  var nodeIsArrayBuffer = _nodeUtil.default && _nodeUtil.default.isArrayBuffer;

  /**
   * Checks if `value` is classified as an `ArrayBuffer` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
   * @example
   *
   * _.isArrayBuffer(new ArrayBuffer(2));
   * // => true
   *
   * _.isArrayBuffer(new Array(2));
   * // => false
   */
  var isArrayBuffer = nodeIsArrayBuffer ? (0, _baseUnary.default)(nodeIsArrayBuffer) : _baseIsArrayBuffer.default;

  exports.default = isArrayBuffer;
});