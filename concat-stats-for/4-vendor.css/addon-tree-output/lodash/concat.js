define('lodash/concat', ['exports', 'lodash/_arrayPush', 'lodash/_baseFlatten', 'lodash/_copyArray', 'lodash/isArray'], function (exports, _arrayPush, _baseFlatten, _copyArray, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a new array concatenating `array` with any additional arrays
   * and/or values.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to concatenate.
   * @param {...*} [values] The values to concatenate.
   * @returns {Array} Returns the new concatenated array.
   * @example
   *
   * var array = [1];
   * var other = _.concat(array, 2, [3], [[4]]);
   *
   * console.log(other);
   * // => [1, 2, 3, [4]]
   *
   * console.log(array);
   * // => [1]
   */
  function concat() {
    var length = arguments.length;
    if (!length) {
      return [];
    }
    var args = Array(length - 1),
        array = arguments[0],
        index = length;

    while (index--) {
      args[index - 1] = arguments[index];
    }
    return (0, _arrayPush.default)((0, _isArray.default)(array) ? (0, _copyArray.default)(array) : [array], (0, _baseFlatten.default)(args, 1));
  }

  exports.default = concat;
});