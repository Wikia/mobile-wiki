define('lodash/_baseSetData', ['exports', 'lodash/identity', 'lodash/_metaMap'], function (exports, _identity, _metaMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `setData` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var baseSetData = !_metaMap.default ? _identity.default : function (func, data) {
    _metaMap.default.set(func, data);
    return func;
  };

  exports.default = baseSetData;
});