define('lodash/isNative', ['exports', 'lodash/_baseIsNative', 'lodash/_isMaskable'], function (exports, _baseIsNative, _isMaskable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.';

  /**
   * Checks if `value` is a pristine native function.
   *
   * **Note:** This method can't reliably detect native functions in the presence
   * of the core-js package because core-js circumvents this kind of detection.
   * Despite multiple requests, the core-js maintainer has made it clear: any
   * attempt to fix the detection will be obstructed. As a result, we're left
   * with little choice but to throw an error. Unfortunately, this also affects
   * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
   * which rely on core-js.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
  function isNative(value) {
    if ((0, _isMaskable.default)(value)) {
      throw new Error(CORE_ERROR_TEXT);
    }
    return (0, _baseIsNative.default)(value);
  }

  exports.default = isNative;
});