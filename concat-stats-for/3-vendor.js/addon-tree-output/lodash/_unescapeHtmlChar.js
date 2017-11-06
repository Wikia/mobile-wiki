define('lodash/_unescapeHtmlChar', ['exports', 'lodash/_basePropertyOf'], function (exports, _basePropertyOf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = (0, _basePropertyOf.default)(htmlUnescapes);

  exports.default = unescapeHtmlChar;
});