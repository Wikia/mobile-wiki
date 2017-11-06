define('lodash/pullAll', ['exports', 'lodash/_basePullAll'], function (exports, _basePullAll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.pull` except that it accepts an array of values to remove.
   *
   * **Note:** Unlike `_.difference`, this method mutates `array`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Array
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @returns {Array} Returns `array`.
   * @example
   *
   * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
   *
   * _.pullAll(array, ['a', 'c']);
   * console.log(array);
   * // => ['b', 'b']
   */
  function pullAll(array, values) {
    return array && array.length && values && values.length ? (0, _basePullAll.default)(array, values) : array;
  }

  exports.default = pullAll;
});