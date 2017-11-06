define('lodash/_baseShuffle', ['exports', 'lodash/_shuffleSelf', 'lodash/values'], function (exports, _shuffleSelf, _values) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.shuffle`.
   *
   * @private
   * @param {Array|Object} collection The collection to shuffle.
   * @returns {Array} Returns the new shuffled array.
   */
  function baseShuffle(collection) {
    return (0, _shuffleSelf.default)((0, _values.default)(collection));
  }

  exports.default = baseShuffle;
});