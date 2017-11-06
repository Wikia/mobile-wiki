define('lodash/union', ['exports', 'lodash/_baseFlatten', 'lodash/_baseRest', 'lodash/_baseUniq', 'lodash/isArrayLikeObject'], function (exports, _baseFlatten, _baseRest, _baseUniq, _isArrayLikeObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an array of unique values, in order, from all given arrays using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of combined values.
   * @example
   *
   * _.union([2], [1, 2]);
   * // => [2, 1]
   */
  var union = (0, _baseRest.default)(function (arrays) {
    return (0, _baseUniq.default)((0, _baseFlatten.default)(arrays, 1, _isArrayLikeObject.default, true));
  });

  exports.default = union;
});