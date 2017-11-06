define('lodash/nthArg', ['exports', 'lodash/_baseNth', 'lodash/_baseRest', 'lodash/toInteger'], function (exports, _baseNth, _baseRest, _toInteger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function that gets the argument at index `n`. If `n` is negative,
   * the nth argument from the end is returned.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Util
   * @param {number} [n=0] The index of the argument to return.
   * @returns {Function} Returns the new pass-thru function.
   * @example
   *
   * var func = _.nthArg(1);
   * func('a', 'b', 'c', 'd');
   * // => 'b'
   *
   * var func = _.nthArg(-2);
   * func('a', 'b', 'c', 'd');
   * // => 'c'
   */
  function nthArg(n) {
    n = (0, _toInteger.default)(n);
    return (0, _baseRest.default)(function (args) {
      return (0, _baseNth.default)(args, n);
    });
  }

  exports.default = nthArg;
});