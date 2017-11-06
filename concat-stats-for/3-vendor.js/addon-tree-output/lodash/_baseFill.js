define('lodash/_baseFill', ['exports', 'lodash/toInteger', 'lodash/toLength'], function (exports, _toInteger, _toLength) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.fill` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to fill.
   * @param {*} value The value to fill `array` with.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns `array`.
   */
  function baseFill(array, value, start, end) {
    var length = array.length;

    start = (0, _toInteger.default)(start);
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end === undefined || end > length ? length : (0, _toInteger.default)(end);
    if (end < 0) {
      end += length;
    }
    end = start > end ? 0 : (0, _toLength.default)(end);
    while (start < end) {
      array[start++] = value;
    }
    return array;
  }

  exports.default = baseFill;
});