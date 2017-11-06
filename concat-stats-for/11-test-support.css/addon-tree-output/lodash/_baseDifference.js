define('lodash/_baseDifference', ['exports', 'lodash/_SetCache', 'lodash/_arrayIncludes', 'lodash/_arrayIncludesWith', 'lodash/_arrayMap', 'lodash/_baseUnary', 'lodash/_cacheHas'], function (exports, _SetCache, _arrayIncludes, _arrayIncludesWith, _arrayMap, _baseUnary, _cacheHas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * The base implementation of methods like `_.difference` without support
   * for excluding multiple arrays or iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Array} values The values to exclude.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of filtered values.
   */
  function baseDifference(array, values, iteratee, comparator) {
    var index = -1,
        includes = _arrayIncludes.default,
        isCommon = true,
        length = array.length,
        result = [],
        valuesLength = values.length;

    if (!length) {
      return result;
    }
    if (iteratee) {
      values = (0, _arrayMap.default)(values, (0, _baseUnary.default)(iteratee));
    }
    if (comparator) {
      includes = _arrayIncludesWith.default;
      isCommon = false;
    } else if (values.length >= LARGE_ARRAY_SIZE) {
      includes = _cacheHas.default;
      isCommon = false;
      values = new _SetCache.default(values);
    }
    outer: while (++index < length) {
      var value = array[index],
          computed = iteratee == null ? value : iteratee(value);

      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes(values, computed, comparator)) {
        result.push(value);
      }
    }
    return result;
  }

  exports.default = baseDifference;
});