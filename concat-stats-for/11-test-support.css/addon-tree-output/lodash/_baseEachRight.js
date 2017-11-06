define('lodash/_baseEachRight', ['exports', 'lodash/_baseForOwnRight', 'lodash/_createBaseEach'], function (exports, _baseForOwnRight, _createBaseEach) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.forEachRight` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEachRight = (0, _createBaseEach.default)(_baseForOwnRight.default, true);

  exports.default = baseEachRight;
});