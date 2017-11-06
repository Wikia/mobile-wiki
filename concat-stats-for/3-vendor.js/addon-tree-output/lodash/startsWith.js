define('lodash/startsWith', ['exports', 'lodash/_baseClamp', 'lodash/_baseToString', 'lodash/toInteger', 'lodash/toString'], function (exports, _baseClamp, _baseToString, _toInteger, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if `string` starts with the given target string.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to inspect.
   * @param {string} [target] The string to search for.
   * @param {number} [position=0] The position to search from.
   * @returns {boolean} Returns `true` if `string` starts with `target`,
   *  else `false`.
   * @example
   *
   * _.startsWith('abc', 'a');
   * // => true
   *
   * _.startsWith('abc', 'b');
   * // => false
   *
   * _.startsWith('abc', 'b', 1);
   * // => true
   */
  function startsWith(string, target, position) {
    string = (0, _toString.default)(string);
    position = position == null ? 0 : (0, _baseClamp.default)((0, _toInteger.default)(position), 0, string.length);

    target = (0, _baseToString.default)(target);
    return string.slice(position, position + target.length) == target;
  }

  exports.default = startsWith;
});