define('lodash/_escapeHtmlChar', ['exports', 'lodash/_basePropertyOf'], function (exports, _basePropertyOf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = (0, _basePropertyOf.default)(htmlEscapes);

  exports.default = escapeHtmlChar;
});