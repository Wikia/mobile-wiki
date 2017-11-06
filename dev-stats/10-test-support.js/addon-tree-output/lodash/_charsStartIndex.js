define('lodash/_charsStartIndex', ['exports', 'lodash/_baseIndexOf'], function (exports, _baseIndexOf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && (0, _baseIndexOf.default)(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  exports.default = charsStartIndex;
});