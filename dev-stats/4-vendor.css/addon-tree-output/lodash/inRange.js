define('lodash/inRange', ['exports', 'lodash/_baseInRange', 'lodash/toFinite', 'lodash/toNumber'], function (exports, _baseInRange, _toFinite, _toNumber) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if `n` is between `start` and up to, but not including, `end`. If
   * `end` is not specified, it's set to `start` with `start` then set to `0`.
   * If `start` is greater than `end` the params are swapped to support
   * negative ranges.
   *
   * @static
   * @memberOf _
   * @since 3.3.0
   * @category Number
   * @param {number} number The number to check.
   * @param {number} [start=0] The start of the range.
   * @param {number} end The end of the range.
   * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
   * @see _.range, _.rangeRight
   * @example
   *
   * _.inRange(3, 2, 4);
   * // => true
   *
   * _.inRange(4, 8);
   * // => true
   *
   * _.inRange(4, 2);
   * // => false
   *
   * _.inRange(2, 2);
   * // => false
   *
   * _.inRange(1.2, 2);
   * // => true
   *
   * _.inRange(5.2, 4);
   * // => false
   *
   * _.inRange(-3, -2, -6);
   * // => true
   */
  function inRange(number, start, end) {
    start = (0, _toFinite.default)(start);
    if (end === undefined) {
      end = start;
      start = 0;
    } else {
      end = (0, _toFinite.default)(end);
    }
    number = (0, _toNumber.default)(number);
    return (0, _baseInRange.default)(number, start, end);
  }

  exports.default = inRange;
});