define('lodash/_basePullAll', ['exports', 'lodash/_arrayMap', 'lodash/_baseIndexOf', 'lodash/_baseIndexOfWith', 'lodash/_baseUnary', 'lodash/_copyArray'], function (exports, _arrayMap, _baseIndexOf, _baseIndexOfWith, _baseUnary, _copyArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * The base implementation of `_.pullAllBy` without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to remove.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns `array`.
   */
  function basePullAll(array, values, iteratee, comparator) {
    var indexOf = comparator ? _baseIndexOfWith.default : _baseIndexOf.default,
        index = -1,
        length = values.length,
        seen = array;

    if (array === values) {
      values = (0, _copyArray.default)(values);
    }
    if (iteratee) {
      seen = (0, _arrayMap.default)(array, (0, _baseUnary.default)(iteratee));
    }
    while (++index < length) {
      var fromIndex = 0,
          value = values[index],
          computed = iteratee ? iteratee(value) : value;

      while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
        if (seen !== array) {
          splice.call(seen, fromIndex, 1);
        }
        splice.call(array, fromIndex, 1);
      }
    }
    return array;
  }

  exports.default = basePullAll;
});