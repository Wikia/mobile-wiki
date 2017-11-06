define('lodash/intersection', ['exports', 'lodash/_arrayMap', 'lodash/_baseIntersection', 'lodash/_baseRest', 'lodash/_castArrayLikeObject'], function (exports, _arrayMap, _baseIntersection, _baseRest, _castArrayLikeObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an array of unique values that are included in all given arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. The order and references of result values are
   * determined by the first array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of intersecting values.
   * @example
   *
   * _.intersection([2, 1], [2, 3]);
   * // => [2]
   */
  var intersection = (0, _baseRest.default)(function (arrays) {
    var mapped = (0, _arrayMap.default)(arrays, _castArrayLikeObject.default);
    return mapped.length && mapped[0] === arrays[0] ? (0, _baseIntersection.default)(mapped) : [];
  });

  exports.default = intersection;
});