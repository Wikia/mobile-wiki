define('lodash/capitalize', ['exports', 'lodash/toString', 'lodash/upperFirst'], function (exports, _toString, _upperFirst) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Converts the first character of `string` to upper case and the remaining
   * to lower case.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to capitalize.
   * @returns {string} Returns the capitalized string.
   * @example
   *
   * _.capitalize('FRED');
   * // => 'Fred'
   */
  function capitalize(string) {
    return (0, _upperFirst.default)((0, _toString.default)(string).toLowerCase());
  }

  exports.default = capitalize;
});