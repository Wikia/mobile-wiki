define('lodash/rearg', ['exports', 'lodash/_createWrap', 'lodash/_flatRest'], function (exports, _createWrap, _flatRest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for function metadata. */
  var WRAP_REARG_FLAG = 256;

  /**
   * Creates a function that invokes `func` with arguments arranged according
   * to the specified `indexes` where the argument value at the first index is
   * provided as the first argument, the argument value at the second index is
   * provided as the second argument, and so on.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {Function} func The function to rearrange arguments for.
   * @param {...(number|number[])} indexes The arranged argument indexes.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var rearged = _.rearg(function(a, b, c) {
   *   return [a, b, c];
   * }, [2, 0, 1]);
   *
   * rearged('b', 'c', 'a')
   * // => ['a', 'b', 'c']
   */
  var rearg = (0, _flatRest.default)(function (func, indexes) {
    return (0, _createWrap.default)(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
  });

  exports.default = rearg;
});