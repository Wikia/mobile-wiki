define('lodash/pullAt', ['exports', 'lodash/_arrayMap', 'lodash/_baseAt', 'lodash/_basePullAt', 'lodash/_compareAscending', 'lodash/_flatRest', 'lodash/_isIndex'], function (exports, _arrayMap, _baseAt, _basePullAt, _compareAscending, _flatRest, _isIndex) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Removes elements from `array` corresponding to `indexes` and returns an
   * array of removed elements.
   *
   * **Note:** Unlike `_.at`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to modify.
   * @param {...(number|number[])} [indexes] The indexes of elements to remove.
   * @returns {Array} Returns the new array of removed elements.
   * @example
   *
   * var array = ['a', 'b', 'c', 'd'];
   * var pulled = _.pullAt(array, [1, 3]);
   *
   * console.log(array);
   * // => ['a', 'c']
   *
   * console.log(pulled);
   * // => ['b', 'd']
   */
  var pullAt = (0, _flatRest.default)(function (array, indexes) {
    var length = array == null ? 0 : array.length,
        result = (0, _baseAt.default)(array, indexes);

    (0, _basePullAt.default)(array, (0, _arrayMap.default)(indexes, function (index) {
      return (0, _isIndex.default)(index, length) ? +index : index;
    }).sort(_compareAscending.default));

    return result;
  });

  exports.default = pullAt;
});