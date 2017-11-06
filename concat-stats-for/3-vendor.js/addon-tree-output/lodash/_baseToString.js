define('lodash/_baseToString', ['exports', 'lodash/_Symbol', 'lodash/_arrayMap', 'lodash/isArray', 'lodash/isSymbol'], function (exports, _Symbol2, _arrayMap, _isArray, _isSymbol) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol2.default ? _Symbol2.default.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if ((0, _isArray.default)(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return (0, _arrayMap.default)(value, baseToString) + '';
    }
    if ((0, _isSymbol.default)(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }

  exports.default = baseToString;
});