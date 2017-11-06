define('lodash/overSome', ['exports', 'lodash/_arraySome', 'lodash/_createOver'], function (exports, _arraySome, _createOver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function that checks if **any** of the `predicates` return
   * truthy when invoked with the arguments it receives.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Util
   * @param {...(Function|Function[])} [predicates=[_.identity]]
   *  The predicates to check.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var func = _.overSome([Boolean, isFinite]);
   *
   * func('1');
   * // => true
   *
   * func(null);
   * // => true
   *
   * func(NaN);
   * // => false
   */
  var overSome = (0, _createOver.default)(_arraySome.default);

  exports.default = overSome;
});