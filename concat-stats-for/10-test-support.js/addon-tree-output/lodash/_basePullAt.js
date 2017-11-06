define('lodash/_basePullAt', ['exports', 'lodash/_baseUnset', 'lodash/_isIndex'], function (exports, _baseUnset, _isIndex) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * The base implementation of `_.pullAt` without support for individual
   * indexes or capturing the removed elements.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {number[]} indexes The indexes of elements to remove.
   * @returns {Array} Returns `array`.
   */
  function basePullAt(array, indexes) {
    var length = array ? indexes.length : 0,
        lastIndex = length - 1;

    while (length--) {
      var index = indexes[length];
      if (length == lastIndex || index !== previous) {
        var previous = index;
        if ((0, _isIndex.default)(index)) {
          splice.call(array, index, 1);
        } else {
          (0, _baseUnset.default)(array, index);
        }
      }
    }
    return array;
  }

  exports.default = basePullAt;
});