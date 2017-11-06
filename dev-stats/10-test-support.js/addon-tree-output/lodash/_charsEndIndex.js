define('lodash/_charsEndIndex', ['exports', 'lodash/_baseIndexOf'], function (exports, _baseIndexOf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && (0, _baseIndexOf.default)(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  exports.default = charsEndIndex;
});