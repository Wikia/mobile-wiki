define('lodash/_mapCacheGet', ['exports', 'lodash/_getMapData'], function (exports, _getMapData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return (0, _getMapData.default)(this, key).get(key);
  }

  exports.default = mapCacheGet;
});