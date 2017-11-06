define('lodash/unionWith', ['exports', 'lodash/_baseFlatten', 'lodash/_baseRest', 'lodash/_baseUniq', 'lodash/isArrayLikeObject', 'lodash/last'], function (exports, _baseFlatten, _baseRest, _baseUniq, _isArrayLikeObject, _last) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.union` except that it accepts `comparator` which
   * is invoked to compare elements of `arrays`. Result values are chosen from
   * the first array in which the value occurs. The comparator is invoked
   * with two arguments: (arrVal, othVal).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of combined values.
   * @example
   *
   * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
   * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
   *
   * _.unionWith(objects, others, _.isEqual);
   * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
   */
  var unionWith = (0, _baseRest.default)(function (arrays) {
    var comparator = (0, _last.default)(arrays);
    comparator = typeof comparator == 'function' ? comparator : undefined;
    return (0, _baseUniq.default)((0, _baseFlatten.default)(arrays, 1, _isArrayLikeObject.default, true), undefined, comparator);
  });

  exports.default = unionWith;
});