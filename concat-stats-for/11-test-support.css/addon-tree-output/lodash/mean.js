define('lodash/mean', ['exports', 'lodash/_baseMean', 'lodash/identity'], function (exports, _baseMean, _identity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Computes the mean of the values in `array`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Math
   * @param {Array} array The array to iterate over.
   * @returns {number} Returns the mean.
   * @example
   *
   * _.mean([4, 2, 8, 6]);
   * // => 5
   */
  function mean(array) {
    return (0, _baseMean.default)(array, _identity.default);
  }

  exports.default = mean;
});