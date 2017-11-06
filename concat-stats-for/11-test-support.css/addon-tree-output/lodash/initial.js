define('lodash/initial', ['exports', 'lodash/_baseSlice'], function (exports, _baseSlice) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets all but the last element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to query.
   * @returns {Array} Returns the slice of `array`.
   * @example
   *
   * _.initial([1, 2, 3]);
   * // => [1, 2]
   */
  function initial(array) {
    var length = array == null ? 0 : array.length;
    return length ? (0, _baseSlice.default)(array, 0, -1) : [];
  }

  exports.default = initial;
});