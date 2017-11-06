define('lodash/_MapCache', ['exports', 'lodash/_mapCacheClear', 'lodash/_mapCacheDelete', 'lodash/_mapCacheGet', 'lodash/_mapCacheHas', 'lodash/_mapCacheSet'], function (exports, _mapCacheClear, _mapCacheDelete, _mapCacheGet, _mapCacheHas, _mapCacheSet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = _mapCacheClear.default;
  MapCache.prototype['delete'] = _mapCacheDelete.default;
  MapCache.prototype.get = _mapCacheGet.default;
  MapCache.prototype.has = _mapCacheHas.default;
  MapCache.prototype.set = _mapCacheSet.default;

  exports.default = MapCache;
});