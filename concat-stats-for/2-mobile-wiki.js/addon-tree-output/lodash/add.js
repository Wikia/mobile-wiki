define('lodash/add', ['exports', 'lodash/_createMathOperation'], function (exports, _createMathOperation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Adds two numbers.
   *
   * @static
   * @memberOf _
   * @since 3.4.0
   * @category Math
   * @param {number} augend The first number in an addition.
   * @param {number} addend The second number in an addition.
   * @returns {number} Returns the total.
   * @example
   *
   * _.add(6, 4);
   * // => 10
   */
  var add = (0, _createMathOperation.default)(function (augend, addend) {
    return augend + addend;
  }, 0);

  exports.default = add;
});