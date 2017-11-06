define('lodash/min', ['exports', 'lodash/_baseExtremum', 'lodash/_baseLt', 'lodash/identity'], function (exports, _baseExtremum, _baseLt, _identity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Computes the minimum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the minimum value.
   * @example
   *
   * _.min([4, 2, 8, 6]);
   * // => 2
   *
   * _.min([]);
   * // => undefined
   */
  function min(array) {
    return array && array.length ? (0, _baseExtremum.default)(array, _identity.default, _baseLt.default) : undefined;
  }

  exports.default = min;
});