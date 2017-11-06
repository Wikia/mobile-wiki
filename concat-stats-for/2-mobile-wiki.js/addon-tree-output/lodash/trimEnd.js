define('lodash/trimEnd', ['exports', 'lodash/_baseToString', 'lodash/_castSlice', 'lodash/_charsEndIndex', 'lodash/_stringToArray', 'lodash/toString'], function (exports, _baseToString, _castSlice, _charsEndIndex, _stringToArray, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to match leading and trailing whitespace. */
  var reTrimEnd = /\s+$/;

  /**
   * Removes trailing whitespace or specified characters from `string`.
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
   * _.trimEnd('  abc  ');
   * // => '  abc'
   *
   * _.trimEnd('-_-abc-_-', '_-');
   * // => '-_-abc'
   */
  function trimEnd(string, chars, guard) {
    string = (0, _toString.default)(string);
    if (string && (guard || chars === undefined)) {
      return string.replace(reTrimEnd, '');
    }
    if (!string || !(chars = (0, _baseToString.default)(chars))) {
      return string;
    }
    var strSymbols = (0, _stringToArray.default)(string),
        end = (0, _charsEndIndex.default)(strSymbols, (0, _stringToArray.default)(chars)) + 1;

    return (0, _castSlice.default)(strSymbols, 0, end).join('');
  }

  exports.default = trimEnd;
});