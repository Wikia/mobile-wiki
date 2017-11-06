define('lodash/_mapCacheClear', ['exports', 'lodash/_Hash', 'lodash/_ListCache', 'lodash/_Map'], function (exports, _Hash, _ListCache, _Map) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash.default(),
      'map': new (_Map.default || _ListCache.default)(),
      'string': new _Hash.default()
    };
  }

  exports.default = mapCacheClear;
});