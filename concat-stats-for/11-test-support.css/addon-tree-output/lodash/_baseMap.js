define('lodash/_baseMap', ['exports', 'lodash/_baseEach', 'lodash/isArrayLike'], function (exports, _baseEach, _isArrayLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.map` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var index = -1,
        result = (0, _isArrayLike.default)(collection) ? Array(collection.length) : [];

    (0, _baseEach.default)(collection, function (value, key, collection) {
      result[++index] = iteratee(value, key, collection);
    });
    return result;
  }

  exports.default = baseMap;
});