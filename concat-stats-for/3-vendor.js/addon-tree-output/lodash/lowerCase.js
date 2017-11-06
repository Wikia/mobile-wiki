define('lodash/lowerCase', ['exports', 'lodash/_createCompounder'], function (exports, _createCompounder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Converts `string`, as space separated words, to lower case.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category String
   * @param {string} [string=''] The string to convert.
   * @returns {string} Returns the lower cased string.
   * @example
   *
   * _.lowerCase('--Foo-Bar--');
   * // => 'foo bar'
   *
   * _.lowerCase('fooBar');
   * // => 'foo bar'
   *
   * _.lowerCase('__FOO_BAR__');
   * // => 'foo bar'
   */
  var lowerCase = (0, _createCompounder.default)(function (result, word, index) {
    return result + (index ? ' ' : '') + word.toLowerCase();
  });

  exports.default = lowerCase;
});