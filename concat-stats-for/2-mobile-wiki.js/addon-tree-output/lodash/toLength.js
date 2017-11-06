define('lodash/toLength', ['exports', 'lodash/_baseClamp', 'lodash/toInteger'], function (exports, _baseClamp, _toInteger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295;

  /**
   * Converts `value` to an integer suitable for use as the length of an
   * array-like object.
   *
   * **Note:** This method is based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toLength(3.2);
   * // => 3
   *
   * _.toLength(Number.MIN_VALUE);
   * // => 0
   *
   * _.toLength(Infinity);
   * // => 4294967295
   *
   * _.toLength('3.2');
   * // => 3
   */
  function toLength(value) {
    return value ? (0, _baseClamp.default)((0, _toInteger.default)(value), 0, MAX_ARRAY_LENGTH) : 0;
  }

  exports.default = toLength;
});