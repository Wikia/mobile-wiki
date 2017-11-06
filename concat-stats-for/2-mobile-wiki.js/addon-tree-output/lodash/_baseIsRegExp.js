define('lodash/_baseIsRegExp', ['exports', 'lodash/_baseGetTag', 'lodash/isObjectLike'], function (exports, _baseGetTag, _isObjectLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var regexpTag = '[object RegExp]';

  /**
   * The base implementation of `_.isRegExp` without Node optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   */
  function baseIsRegExp(value) {
    return (0, _isObjectLike.default)(value) && (0, _baseGetTag.default)(value) == regexpTag;
  }

  exports.default = baseIsRegExp;
});