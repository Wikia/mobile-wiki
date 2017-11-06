define('lodash/isElement', ['exports', 'lodash/isObjectLike', 'lodash/isPlainObject'], function (exports, _isObjectLike, _isPlainObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if `value` is likely a DOM element.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
   * @example
   *
   * _.isElement(document.body);
   * // => true
   *
   * _.isElement('<body>');
   * // => false
   */
  function isElement(value) {
    return (0, _isObjectLike.default)(value) && value.nodeType === 1 && !(0, _isPlainObject.default)(value);
  }

  exports.default = isElement;
});