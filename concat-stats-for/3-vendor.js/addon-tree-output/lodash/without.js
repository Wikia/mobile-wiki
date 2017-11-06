define('lodash/without', ['exports', 'lodash/_baseDifference', 'lodash/_baseRest', 'lodash/isArrayLikeObject'], function (exports, _baseDifference, _baseRest, _isArrayLikeObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an array excluding all given values using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * **Note:** Unlike `_.pull`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...*} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @see _.difference, _.xor
   * @example
   *
   * _.without([2, 1, 2, 3], 1, 2);
   * // => [3]
   */
  var without = (0, _baseRest.default)(function (array, values) {
    return (0, _isArrayLikeObject.default)(array) ? (0, _baseDifference.default)(array, values) : [];
  });

  exports.default = without;
});