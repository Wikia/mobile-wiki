define('lodash/differenceWith', ['exports', 'lodash/_baseDifference', 'lodash/_baseFlatten', 'lodash/_baseRest', 'lodash/isArrayLikeObject', 'lodash/last'], function (exports, _baseDifference, _baseFlatten, _baseRest, _isArrayLikeObject, _last) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.difference` except that it accepts `comparator`
   * which is invoked to compare elements of `array` to `values`. The order and
   * references of result values are determined by the first array. The comparator
   * is invoked with two arguments: (arrVal, othVal).
   *
   * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...Array} [values] The values to exclude.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
   *
   * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
   * // => [{ 'x': 2, 'y': 1 }]
   */
  var differenceWith = (0, _baseRest.default)(function (array, values) {
    var comparator = (0, _last.default)(values);
    if ((0, _isArrayLikeObject.default)(comparator)) {
      comparator = undefined;
    }
    return (0, _isArrayLikeObject.default)(array) ? (0, _baseDifference.default)(array, (0, _baseFlatten.default)(values, 1, _isArrayLikeObject.default, true), undefined, comparator) : [];
  });

  exports.default = differenceWith;
});