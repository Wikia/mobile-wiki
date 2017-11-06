define('lodash/difference', ['exports', 'lodash/_baseDifference', 'lodash/_baseFlatten', 'lodash/_baseRest', 'lodash/isArrayLikeObject'], function (exports, _baseDifference, _baseFlatten, _baseRest, _isArrayLikeObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an array of `array` values not included in the other given arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. The order and references of result values are
   * determined by the first array.
   *
   * **Note:** Unlike `_.pullAll`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...Array} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @see _.without, _.xor
   * @example
   *
   * _.difference([2, 1], [2, 3]);
   * // => [1]
   */
  var difference = (0, _baseRest.default)(function (array, values) {
    return (0, _isArrayLikeObject.default)(array) ? (0, _baseDifference.default)(array, (0, _baseFlatten.default)(values, 1, _isArrayLikeObject.default, true)) : [];
  });

  exports.default = difference;
});