define('lodash/_asciiToArray', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  exports.default = asciiToArray;
});