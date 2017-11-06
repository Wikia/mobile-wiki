define('lodash/method', ['exports', 'lodash/_baseInvoke', 'lodash/_baseRest'], function (exports, _baseInvoke, _baseRest) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function that invokes the method at `path` of a given object.
   * Any additional arguments are provided to the invoked method.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Util
   * @param {Array|string} path The path of the method to invoke.
   * @param {...*} [args] The arguments to invoke the method with.
   * @returns {Function} Returns the new invoker function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': _.constant(2) } },
   *   { 'a': { 'b': _.constant(1) } }
   * ];
   *
   * _.map(objects, _.method('a.b'));
   * // => [2, 1]
   *
   * _.map(objects, _.method(['a', 'b']));
   * // => [2, 1]
   */
  var method = (0, _baseRest.default)(function (path, args) {
    return function (object) {
      return (0, _baseInvoke.default)(object, path, args);
    };
  });

  exports.default = method;
});