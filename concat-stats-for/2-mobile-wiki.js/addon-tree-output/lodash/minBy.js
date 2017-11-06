define('lodash/minBy', ['exports', 'lodash/_baseExtremum', 'lodash/_baseIteratee', 'lodash/_baseLt'], function (exports, _baseExtremum, _baseIteratee, _baseLt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.min` except that it accepts `iteratee` which is
   * invoked for each element in `array` to generate the criterion by which
   * the value is ranked. The iteratee is invoked with one argument: (value).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Math
   * @param {Array} array The array to iterate over.
   * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * var objects = [{ 'n': 1 }, { 'n': 2 }];
   *
   * _.minBy(objects, function(o) { return o.n; });
   * // => { 'n': 1 }
   *
   * // The `_.property` iteratee shorthand.
   * _.minBy(objects, 'n');
   * // => { 'n': 1 }
   */
  function minBy(array, iteratee) {
    return array && array.length ? (0, _baseExtremum.default)(array, (0, _baseIteratee.default)(iteratee, 2), _baseLt.default) : undefined;
  }

  exports.default = minBy;
});