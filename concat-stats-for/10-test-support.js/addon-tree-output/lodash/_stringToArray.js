define('lodash/_stringToArray', ['exports', 'lodash/_asciiToArray', 'lodash/_hasUnicode', 'lodash/_unicodeToArray'], function (exports, _asciiToArray, _hasUnicode, _unicodeToArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return (0, _hasUnicode.default)(string) ? (0, _unicodeToArray.default)(string) : (0, _asciiToArray.default)(string);
  }

  exports.default = stringToArray;
});