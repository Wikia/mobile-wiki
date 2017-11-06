define('lodash/_ListCache', ['exports', 'lodash/_listCacheClear', 'lodash/_listCacheDelete', 'lodash/_listCacheGet', 'lodash/_listCacheHas', 'lodash/_listCacheSet'], function (exports, _listCacheClear, _listCacheDelete, _listCacheGet, _listCacheHas, _listCacheSet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = _listCacheClear.default;
  ListCache.prototype['delete'] = _listCacheDelete.default;
  ListCache.prototype.get = _listCacheGet.default;
  ListCache.prototype.has = _listCacheHas.default;
  ListCache.prototype.set = _listCacheSet.default;

  exports.default = ListCache;
});