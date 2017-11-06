define('lodash/_flatRest', ['exports', 'lodash/flatten', 'lodash/_overRest', 'lodash/_setToString'], function (exports, _flatten, _overRest, _setToString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * A specialized version of `baseRest` which flattens the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @returns {Function} Returns the new function.
   */
  function flatRest(func) {
    return (0, _setToString.default)((0, _overRest.default)(func, undefined, _flatten.default), func + '');
  }

  exports.default = flatRest;
});