define('lodash/_SetCache', ['exports', 'lodash/_MapCache', 'lodash/_setCacheAdd', 'lodash/_setCacheHas'], function (exports, _MapCache, _setCacheAdd, _setCacheHas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new _MapCache.default();
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd.default;
  SetCache.prototype.has = _setCacheHas.default;

  exports.default = SetCache;
});