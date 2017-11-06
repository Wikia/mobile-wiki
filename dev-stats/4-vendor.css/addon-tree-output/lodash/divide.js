define('lodash/divide', ['exports', 'lodash/_createMathOperation'], function (exports, _createMathOperation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Divide two numbers.
   *
   * @static
   * @memberOf _
   * @since 4.7.0
   * @category Math
   * @param {number} dividend The first number in a division.
   * @param {number} divisor The second number in a division.
   * @returns {number} Returns the quotient.
   * @example
   *
   * _.divide(6, 4);
   * // => 1.5
   */
  var divide = (0, _createMathOperation.default)(function (dividend, divisor) {
    return dividend / divisor;
  }, 1);

  exports.default = divide;
});