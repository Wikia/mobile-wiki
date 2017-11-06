define('lodash/kebabCase', ['exports', 'lodash/_createCompounder'], function (exports, _createCompounder) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Converts `string` to
   * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to convert.
   * @returns {string} Returns the kebab cased string.
   * @example
   *
   * _.kebabCase('Foo Bar');
   * // => 'foo-bar'
   *
   * _.kebabCase('fooBar');
   * // => 'foo-bar'
   *
   * _.kebabCase('__FOO_BAR__');
   * // => 'foo-bar'
   */
  var kebabCase = (0, _createCompounder.default)(function (result, word, index) {
    return result + (index ? '-' : '') + word.toLowerCase();
  });

  exports.default = kebabCase;
});