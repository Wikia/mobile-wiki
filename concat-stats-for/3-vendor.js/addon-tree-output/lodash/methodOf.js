define('lodash/methodOf', ['exports', 'lodash/_baseInvoke', 'lodash/_baseRest'], function (exports, _baseInvoke, _baseRest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The opposite of `_.method`; this method creates a function that invokes
   * the method at a given path of `object`. Any additional arguments are
   * provided to the invoked method.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Util
   * @param {Object} object The object to query.
   * @param {...*} [args] The arguments to invoke the method with.
   * @returns {Function} Returns the new invoker function.
   * @example
   *
   * var array = _.times(3, _.constant),
   *     object = { 'a': array, 'b': array, 'c': array };
   *
   * _.map(['a[2]', 'c[0]'], _.methodOf(object));
   * // => [2, 0]
   *
   * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
   * // => [2, 0]
   */
  var methodOf = (0, _baseRest.default)(function (object, args) {
    return function (path) {
      return (0, _baseInvoke.default)(object, path, args);
    };
  });

  exports.default = methodOf;
});