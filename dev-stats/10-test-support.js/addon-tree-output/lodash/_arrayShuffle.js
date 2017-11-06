define('lodash/_arrayShuffle', ['exports', 'lodash/_copyArray', 'lodash/_shuffleSelf'], function (exports, _copyArray, _shuffleSelf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * A specialized version of `_.shuffle` for arrays.
   *
   * @private
   * @param {Array} array The array to shuffle.
   * @returns {Array} Returns the new shuffled array.
   */
  function arrayShuffle(array) {
    return (0, _shuffleSelf.default)((0, _copyArray.default)(array));
  }

  exports.default = arrayShuffle;
});