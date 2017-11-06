define('lodash/_baseEach', ['exports', 'lodash/_baseForOwn', 'lodash/_createBaseEach'], function (exports, _baseForOwn, _createBaseEach) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = (0, _createBaseEach.default)(_baseForOwn.default);

  exports.default = baseEach;
});