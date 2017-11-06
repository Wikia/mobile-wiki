define('lodash/trimStart', ['exports', 'lodash/_baseToString', 'lodash/_castSlice', 'lodash/_charsStartIndex', 'lodash/_stringToArray', 'lodash/toString'], function (exports, _baseToString, _castSlice, _charsStartIndex, _stringToArray, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to match leading and trailing whitespace. */
  var reTrimStart = /^\s+/;

  /**
   * Removes leading whitespace or specified characters from `string`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category String
   * @param {string} [string=''] The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {string} Returns the trimmed string.
   * @example
   *
   * _.trimStart('  abc  ');
   * // => 'abc  '
   *
   * _.trimStart('-_-abc-_-', '_-');
   * // => 'abc-_-'
   */
  function trimStart(string, chars, guard) {
    string = (0, _toString.default)(string);
    if (string && (guard || chars === undefined)) {
      return string.replace(reTrimStart, '');
    }
    if (!string || !(chars = (0, _baseToString.default)(chars))) {
      return string;
    }
    var strSymbols = (0, _stringToArray.default)(string),
        start = (0, _charsStartIndex.default)(strSymbols, (0, _stringToArray.default)(chars));

    return (0, _castSlice.default)(strSymbols, start).join('');
  }

  exports.default = trimStart;
});