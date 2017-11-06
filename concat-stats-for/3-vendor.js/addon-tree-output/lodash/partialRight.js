define('lodash/partialRight', ['exports', 'lodash/_baseRest', 'lodash/_createWrap', 'lodash/_getHolder', 'lodash/_replaceHolders'], function (exports, _baseRest, _createWrap, _getHolder, _replaceHolders) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for function metadata. */
  var WRAP_PARTIAL_RIGHT_FLAG = 64;

  /**
   * This method is like `_.partial` except that partially applied arguments
   * are appended to the arguments it receives.
   *
   * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
   * builds, may be used as a placeholder for partially applied arguments.
   *
   * **Note:** This method doesn't set the "length" property of partially
   * applied functions.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category Function
   * @param {Function} func The function to partially apply arguments to.
   * @param {...*} [partials] The arguments to be partially applied.
   * @returns {Function} Returns the new partially applied function.
   * @example
   *
   * function greet(greeting, name) {
   *   return greeting + ' ' + name;
   * }
   *
   * var greetFred = _.partialRight(greet, 'fred');
   * greetFred('hi');
   * // => 'hi fred'
   *
   * // Partially applied with placeholders.
   * var sayHelloTo = _.partialRight(greet, 'hello', _);
   * sayHelloTo('fred');
   * // => 'hello fred'
   */
  var partialRight = (0, _baseRest.default)(function (func, partials) {
    var holders = (0, _replaceHolders.default)(partials, (0, _getHolder.default)(partialRight));
    return (0, _createWrap.default)(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
  });

  // Assign default placeholders.
  partialRight.placeholder = {};

  exports.default = partialRight;
});