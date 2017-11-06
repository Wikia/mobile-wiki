define('lodash/overArgs', ['exports', 'lodash/_apply', 'lodash/_arrayMap', 'lodash/_baseFlatten', 'lodash/_baseIteratee', 'lodash/_baseRest', 'lodash/_baseUnary', 'lodash/_castRest', 'lodash/isArray'], function (exports, _apply, _arrayMap, _baseFlatten, _baseIteratee, _baseRest, _baseUnary, _castRest, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMin = Math.min;

  /**
   * Creates a function that invokes `func` with its arguments transformed.
   *
   * @static
   * @since 4.0.0
   * @memberOf _
   * @category Function
   * @param {Function} func The function to wrap.
   * @param {...(Function|Function[])} [transforms=[_.identity]]
   *  The argument transforms.
   * @returns {Function} Returns the new function.
   * @example
   *
   * function doubled(n) {
   *   return n * 2;
   * }
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var func = _.overArgs(function(x, y) {
   *   return [x, y];
   * }, [square, doubled]);
   *
   * func(9, 3);
   * // => [81, 6]
   *
   * func(10, 5);
   * // => [100, 10]
   */
  var overArgs = (0, _castRest.default)(function (func, transforms) {
    transforms = transforms.length == 1 && (0, _isArray.default)(transforms[0]) ? (0, _arrayMap.default)(transforms[0], (0, _baseUnary.default)(_baseIteratee.default)) : (0, _arrayMap.default)((0, _baseFlatten.default)(transforms, 1), (0, _baseUnary.default)(_baseIteratee.default));

    var funcsLength = transforms.length;
    return (0, _baseRest.default)(function (args) {
      var index = -1,
          length = nativeMin(args.length, funcsLength);

      while (++index < length) {
        args[index] = transforms[index].call(this, args[index]);
      }
      return (0, _apply.default)(func, this, args);
    });
  });

  exports.default = overArgs;
});