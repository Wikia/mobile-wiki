define('lodash/max', ['exports', 'lodash/_baseExtremum', 'lodash/_baseGt', 'lodash/identity'], function (exports, _baseExtremum, _baseGt, _identity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Computes the maximum value of `array`. If `array` is empty or falsey,
   * `undefined` is returned.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {*} Returns the maximum value.
   * @example
   *
   * _.max([4, 2, 8, 6]);
   * // => 8
   *
   * _.max([]);
   * // => undefined
   */
  function max(array) {
    return array && array.length ? (0, _baseExtremum.default)(array, _identity.default, _baseGt.default) : undefined;
  }

  exports.default = max;
});