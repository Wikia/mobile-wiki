define('lodash/toArray', ['exports', 'lodash/_Symbol', 'lodash/_copyArray', 'lodash/_getTag', 'lodash/isArrayLike', 'lodash/isString', 'lodash/_iteratorToArray', 'lodash/_mapToArray', 'lodash/_setToArray', 'lodash/_stringToArray', 'lodash/values'], function (exports, _Symbol2, _copyArray, _getTag, _isArrayLike, _isString, _iteratorToArray, _mapToArray, _setToArray, _stringToArray, _values) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var mapTag = '[object Map]',
      setTag = '[object Set]';

  /** Built-in value references. */
  var symIterator = _Symbol2.default ? _Symbol2.default.iterator : undefined;

  /**
   * Converts `value` to an array.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Array} Returns the converted array.
   * @example
   *
   * _.toArray({ 'a': 1, 'b': 2 });
   * // => [1, 2]
   *
   * _.toArray('abc');
   * // => ['a', 'b', 'c']
   *
   * _.toArray(1);
   * // => []
   *
   * _.toArray(null);
   * // => []
   */
  function toArray(value) {
    if (!value) {
      return [];
    }
    if ((0, _isArrayLike.default)(value)) {
      return (0, _isString.default)(value) ? (0, _stringToArray.default)(value) : (0, _copyArray.default)(value);
    }
    if (symIterator && value[symIterator]) {
      return (0, _iteratorToArray.default)(value[symIterator]());
    }
    var tag = (0, _getTag.default)(value),
        func = tag == mapTag ? _mapToArray.default : tag == setTag ? _setToArray.default : _values.default;

    return func(value);
  }

  exports.default = toArray;
});