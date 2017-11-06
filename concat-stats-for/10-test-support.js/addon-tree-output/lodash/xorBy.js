define('lodash/xorBy', ['exports', 'lodash/_arrayFilter', 'lodash/_baseIteratee', 'lodash/_baseRest', 'lodash/_baseXor', 'lodash/isArrayLikeObject', 'lodash/last'], function (exports, _arrayFilter, _baseIteratee, _baseRest, _baseXor, _isArrayLikeObject, _last) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.xor` except that it accepts `iteratee` which is
   * invoked for each element of each `arrays` to generate the criterion by
   * which by which they're compared. The order of result values is determined
   * by the order they occur in the arrays. The iteratee is invoked with one
   * argument: (value).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
   * // => [1.2, 3.4]
   *
   * // The `_.property` iteratee shorthand.
   * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
   * // => [{ 'x': 2 }]
   */
  var xorBy = (0, _baseRest.default)(function (arrays) {
    var iteratee = (0, _last.default)(arrays);
    if ((0, _isArrayLikeObject.default)(iteratee)) {
      iteratee = undefined;
    }
    return (0, _baseXor.default)((0, _arrayFilter.default)(arrays, _isArrayLikeObject.default), (0, _baseIteratee.default)(iteratee, 2));
  });

  exports.default = xorBy;
});