define('lodash/isRegExp', ['exports', 'lodash/_baseIsRegExp', 'lodash/_baseUnary', 'lodash/_nodeUtil'], function (exports, _baseIsRegExp, _baseUnary, _nodeUtil) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Node helper references. */
  var nodeIsRegExp = _nodeUtil.default && _nodeUtil.default.isRegExp;

  /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */
  var isRegExp = nodeIsRegExp ? (0, _baseUnary.default)(nodeIsRegExp) : _baseIsRegExp.default;

  exports.default = isRegExp;
});