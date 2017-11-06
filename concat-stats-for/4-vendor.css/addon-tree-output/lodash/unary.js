define('lodash/unary', ['exports', 'lodash/ary'], function (exports, _ary) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function that accepts up to one argument, ignoring any
   * additional arguments.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Function
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   * @example
   *
   * _.map(['6', '8', '10'], _.unary(parseInt));
   * // => [6, 8, 10]
   */
  function unary(func) {
    return (0, _ary.default)(func, 1);
  }

  exports.default = unary;
});