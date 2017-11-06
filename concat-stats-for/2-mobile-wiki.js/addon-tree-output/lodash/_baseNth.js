define('lodash/_baseNth', ['exports', 'lodash/_isIndex'], function (exports, _isIndex) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.nth` which doesn't coerce arguments.
   *
   * @private
   * @param {Array} array The array to query.
   * @param {number} n The index of the element to return.
   * @returns {*} Returns the nth element of `array`.
   */
  function baseNth(array, n) {
    var length = array.length;
    if (!length) {
      return;
    }
    n += n < 0 ? length : 0;
    return (0, _isIndex.default)(n, length) ? array[n] : undefined;
  }

  exports.default = baseNth;
});