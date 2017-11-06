define('lodash/ceil', ['exports', 'lodash/_createRound'], function (exports, _createRound) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Computes `number` rounded up to `precision`.
   *
   * @static
   * @memberOf _
   * @since 3.10.0
   * @category Math
   * @param {number} number The number to round up.
   * @param {number} [precision=0] The precision to round up to.
   * @returns {number} Returns the rounded up number.
   * @example
   *
   * _.ceil(4.006);
   * // => 5
   *
   * _.ceil(6.004, 2);
   * // => 6.01
   *
   * _.ceil(6040, -2);
   * // => 6100
   */
  var ceil = (0, _createRound.default)('ceil');

  exports.default = ceil;
});