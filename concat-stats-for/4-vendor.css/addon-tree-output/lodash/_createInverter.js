define('lodash/_createInverter', ['exports', 'lodash/_baseInverter'], function (exports, _baseInverter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function like `_.invertBy`.
   *
   * @private
   * @param {Function} setter The function to set accumulator values.
   * @param {Function} toIteratee The function to resolve iteratees.
   * @returns {Function} Returns the new inverter function.
   */
  function createInverter(setter, toIteratee) {
    return function (object, iteratee) {
      return (0, _baseInverter.default)(object, setter, toIteratee(iteratee), {});
    };
  }

  exports.default = createInverter;
});