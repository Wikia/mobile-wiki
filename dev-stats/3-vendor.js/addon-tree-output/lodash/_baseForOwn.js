define('lodash/_baseForOwn', ['exports', 'lodash/_baseFor', 'lodash/keys'], function (exports, _baseFor, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && (0, _baseFor.default)(object, iteratee, _keys.default);
  }

  exports.default = baseForOwn;
});