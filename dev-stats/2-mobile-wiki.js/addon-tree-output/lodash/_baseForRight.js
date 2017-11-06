define('lodash/_baseForRight', ['exports', 'lodash/_createBaseFor'], function (exports, _createBaseFor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This function is like `baseFor` except that it iterates over properties
   * in the opposite order.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseForRight = (0, _createBaseFor.default)(true);

  exports.default = baseForRight;
});