define('lodash/endsWith', ['exports', 'lodash/_baseClamp', 'lodash/_baseToString', 'lodash/toInteger', 'lodash/toString'], function (exports, _baseClamp, _baseToString, _toInteger, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if `string` ends with the given target string.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to inspect.
   * @param {string} [target] The string to search for.
   * @param {number} [position=string.length] The position to search up to.
   * @returns {boolean} Returns `true` if `string` ends with `target`,
   *  else `false`.
   * @example
   *
   * _.endsWith('abc', 'c');
   * // => true
   *
   * _.endsWith('abc', 'b');
   * // => false
   *
   * _.endsWith('abc', 'b', 2);
   * // => true
   */
  function endsWith(string, target, position) {
    string = (0, _toString.default)(string);
    target = (0, _baseToString.default)(target);

    var length = string.length;
    position = position === undefined ? length : (0, _baseClamp.default)((0, _toInteger.default)(position), 0, length);

    var end = position;
    position -= target.length;
    return position >= 0 && string.slice(position, end) == target;
  }

  exports.default = endsWith;
});