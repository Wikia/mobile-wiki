define('lodash/meanBy', ['exports', 'lodash/_baseIteratee', 'lodash/_baseMean'], function (exports, _baseIteratee, _baseMean) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.mean` except that it accepts `iteratee` which is
   * invoked for each element in `array` to generate the value to be averaged.
   * The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @since 4.7.0
   * @category Math
   * @param {Array} array The array to iterate over.
   * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
   * @returns {number} Returns the mean.
   * @example
   *
   * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
   *
   * _.meanBy(objects, function(o) { return o.n; });
   * // => 5
   *
   * // The `_.property` iteratee shorthand.
   * _.meanBy(objects, 'n');
   * // => 5
   */
  function meanBy(array, iteratee) {
    return (0, _baseMean.default)(array, (0, _baseIteratee.default)(iteratee, 2));
  }

  exports.default = meanBy;
});