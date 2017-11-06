define('lodash/xor', ['exports', 'lodash/_arrayFilter', 'lodash/_baseRest', 'lodash/_baseXor', 'lodash/isArrayLikeObject'], function (exports, _arrayFilter, _baseRest, _baseXor, _isArrayLikeObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an array of unique values that is the
   * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
   * of the given arrays. The order of result values is determined by the order
   * they occur in the arrays.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of filtered values.
   * @see _.difference, _.without
   * @example
   *
   * _.xor([2, 1], [2, 3]);
   * // => [1, 3]
   */
  var xor = (0, _baseRest.default)(function (arrays) {
    return (0, _baseXor.default)((0, _arrayFilter.default)(arrays, _isArrayLikeObject.default));
  });

  exports.default = xor;
});