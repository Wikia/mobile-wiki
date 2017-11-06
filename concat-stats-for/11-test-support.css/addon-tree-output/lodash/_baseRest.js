define('lodash/_baseRest', ['exports', 'lodash/identity', 'lodash/_overRest', 'lodash/_setToString'], function (exports, _identity, _overRest, _setToString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return (0, _setToString.default)((0, _overRest.default)(func, start, _identity.default), func + '');
  }

  exports.default = baseRest;
});