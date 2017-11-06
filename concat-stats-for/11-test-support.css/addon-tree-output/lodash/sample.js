define('lodash/sample', ['exports', 'lodash/_arraySample', 'lodash/_baseSample', 'lodash/isArray'], function (exports, _arraySample, _baseSample, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets a random element from `collection`.
   *
   * @static
   * @memberOf _
   * @since 2.0.0
   * @category Collection
   * @param {Array|Object} collection The collection to sample.
   * @returns {*} Returns the random element.
   * @example
   *
   * _.sample([1, 2, 3, 4]);
   * // => 2
   */
  function sample(collection) {
    var func = (0, _isArray.default)(collection) ? _arraySample.default : _baseSample.default;
    return func(collection);
  }

  exports.default = sample;
});