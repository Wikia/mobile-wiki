define('lodash/lowerFirst', ['exports', 'lodash/_createCaseFirst'], function (exports, _createCaseFirst) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Converts the first character of `string` to lower case.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category String
   * @param {string} [string=''] The string to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.lowerFirst('Fred');
   * // => 'fred'
   *
   * _.lowerFirst('FRED');
   * // => 'fRED'
   */
  var lowerFirst = (0, _createCaseFirst.default)('toLowerCase');

  exports.default = lowerFirst;
});