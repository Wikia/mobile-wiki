define('lodash/_baseConforms', ['exports', 'lodash/_baseConformsTo', 'lodash/keys'], function (exports, _baseConformsTo, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.conforms` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property predicates to conform to.
   * @returns {Function} Returns the new spec function.
   */
  function baseConforms(source) {
    var props = (0, _keys.default)(source);
    return function (object) {
      return (0, _baseConformsTo.default)(object, source, props);
    };
  }

  exports.default = baseConforms;
});