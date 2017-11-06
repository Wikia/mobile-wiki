define('lodash/toPath', ['exports', 'lodash/_arrayMap', 'lodash/_copyArray', 'lodash/isArray', 'lodash/isSymbol', 'lodash/_stringToPath', 'lodash/_toKey', 'lodash/toString'], function (exports, _arrayMap, _copyArray, _isArray, _isSymbol, _stringToPath, _toKey, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Converts `value` to a property path array.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Util
   * @param {*} value The value to convert.
   * @returns {Array} Returns the new property path array.
   * @example
   *
   * _.toPath('a.b.c');
   * // => ['a', 'b', 'c']
   *
   * _.toPath('a[0].b.c');
   * // => ['a', '0', 'b', 'c']
   */
  function toPath(value) {
    if ((0, _isArray.default)(value)) {
      return (0, _arrayMap.default)(value, _toKey.default);
    }
    return (0, _isSymbol.default)(value) ? [value] : (0, _copyArray.default)((0, _stringToPath.default)((0, _toString.default)(value)));
  }

  exports.default = toPath;
});