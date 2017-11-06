define('lodash/_baseSample', ['exports', 'lodash/_arraySample', 'lodash/values'], function (exports, _arraySample, _values) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.sample`.
   *
   * @private
   * @param {Array|Object} collection The collection to sample.
   * @returns {*} Returns the random element.
   */
  function baseSample(collection) {
    return (0, _arraySample.default)((0, _values.default)(collection));
  }

  exports.default = baseSample;
});