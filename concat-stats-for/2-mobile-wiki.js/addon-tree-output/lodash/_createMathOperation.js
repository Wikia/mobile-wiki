define('lodash/_createMathOperation', ['exports', 'lodash/_baseToNumber', 'lodash/_baseToString'], function (exports, _baseToNumber, _baseToString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function that performs a mathematical operation on two values.
   *
   * @private
   * @param {Function} operator The function to perform the operation.
   * @param {number} [defaultValue] The value used for `undefined` arguments.
   * @returns {Function} Returns the new mathematical operation function.
   */
  function createMathOperation(operator, defaultValue) {
    return function (value, other) {
      var result;
      if (value === undefined && other === undefined) {
        return defaultValue;
      }
      if (value !== undefined) {
        result = value;
      }
      if (other !== undefined) {
        if (result === undefined) {
          return other;
        }
        if (typeof value == 'string' || typeof other == 'string') {
          value = (0, _baseToString.default)(value);
          other = (0, _baseToString.default)(other);
        } else {
          value = (0, _baseToNumber.default)(value);
          other = (0, _baseToNumber.default)(other);
        }
        result = operator(value, other);
      }
      return result;
    };
  }

  exports.default = createMathOperation;
});