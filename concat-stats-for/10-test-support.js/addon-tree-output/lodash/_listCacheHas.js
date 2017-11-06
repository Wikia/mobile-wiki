define('lodash/_listCacheHas', ['exports', 'lodash/_assocIndexOf'], function (exports, _assocIndexOf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return (0, _assocIndexOf.default)(this.__data__, key) > -1;
  }

  exports.default = listCacheHas;
});