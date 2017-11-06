define('lodash/_mapCacheHas', ['exports', 'lodash/_getMapData'], function (exports, _getMapData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return (0, _getMapData.default)(this, key).has(key);
  }

  exports.default = mapCacheHas;
});