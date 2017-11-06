define('lodash/_stringSize', ['exports', 'lodash/_asciiSize', 'lodash/_hasUnicode', 'lodash/_unicodeSize'], function (exports, _asciiSize, _hasUnicode, _unicodeSize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return (0, _hasUnicode.default)(string) ? (0, _unicodeSize.default)(string) : (0, _asciiSize.default)(string);
  }

  exports.default = stringSize;
});