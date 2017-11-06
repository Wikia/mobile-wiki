define('lodash/spread', ['exports', 'lodash/_apply', 'lodash/_arrayPush', 'lodash/_baseRest', 'lodash/_castSlice', 'lodash/toInteger'], function (exports, _apply, _arrayPush, _baseRest, _castSlice, _toInteger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * Creates a function that invokes `func` with the `this` binding of the
   * create function and an array of arguments much like
   * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
   *
   * **Note:** This method is based on the
   * [spread operator](https://mdn.io/spread_operator).
   *
   * @static
   * @memberOf _
   * @since 3.2.0
   * @category Function
   * @param {Function} func The function to spread arguments over.
   * @param {number} [start=0] The start position of the spread.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var say = _.spread(function(who, what) {
   *   return who + ' says ' + what;
   * });
   *
   * say(['fred', 'hello']);
   * // => 'fred says hello'
   *
   * var numbers = Promise.all([
   *   Promise.resolve(40),
   *   Promise.resolve(36)
   * ]);
   *
   * numbers.then(_.spread(function(x, y) {
   *   return x + y;
   * }));
   * // => a Promise of 76
   */
  function spread(func, start) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    start = start == null ? 0 : nativeMax((0, _toInteger.default)(start), 0);
    return (0, _baseRest.default)(function (args) {
      var array = args[start],
          otherArgs = (0, _castSlice.default)(args, 0, start);

      if (array) {
        (0, _arrayPush.default)(otherArgs, array);
      }
      return (0, _apply.default)(func, this, otherArgs);
    });
  }

  exports.default = spread;
});