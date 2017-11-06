define('lodash/_baseForOwnRight', ['exports', 'lodash/_baseForRight', 'lodash/keys'], function (exports, _baseForRight, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwnRight(object, iteratee) {
    return object && (0, _baseForRight.default)(object, iteratee, _keys.default);
  }

  exports.default = baseForOwnRight;
});