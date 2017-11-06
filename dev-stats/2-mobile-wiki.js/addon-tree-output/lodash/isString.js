define('lodash/isString', ['exports', 'lodash/_baseGetTag', 'lodash/isArray', 'lodash/isObjectLike'], function (exports, _baseGetTag, _isArray, _isObjectLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var stringTag = '[object String]';

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || !(0, _isArray.default)(value) && (0, _isObjectLike.default)(value) && (0, _baseGetTag.default)(value) == stringTag;
  }

  exports.default = isString;
});