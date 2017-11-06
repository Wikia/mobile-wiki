define('lodash/isError', ['exports', 'lodash/_baseGetTag', 'lodash/isObjectLike', 'lodash/isPlainObject'], function (exports, _baseGetTag, _isObjectLike, _isPlainObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var domExcTag = '[object DOMException]',
      errorTag = '[object Error]';

  /**
   * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
   * `SyntaxError`, `TypeError`, or `URIError` object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
   * @example
   *
   * _.isError(new Error);
   * // => true
   *
   * _.isError(Error);
   * // => false
   */
  function isError(value) {
    if (!(0, _isObjectLike.default)(value)) {
      return false;
    }
    var tag = (0, _baseGetTag.default)(value);
    return tag == errorTag || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !(0, _isPlainObject.default)(value);
  }

  exports.default = isError;
});