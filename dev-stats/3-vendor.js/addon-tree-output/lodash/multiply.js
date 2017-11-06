define('lodash/multiply', ['exports', 'lodash/_createMathOperation'], function (exports, _createMathOperation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Multiply two numbers.
   *
   * @static
   * @memberOf _
   * @since 4.7.0
   * @category Math
   * @param {number} multiplier The first number in a multiplication.
   * @param {number} multiplicand The second number in a multiplication.
   * @returns {number} Returns the product.
   * @example
   *
   * _.multiply(6, 4);
   * // => 24
   */
  var multiply = (0, _createMathOperation.default)(function (multiplier, multiplicand) {
    return multiplier * multiplicand;
  }, 1);

  exports.default = multiply;
});