define('lodash/_stackSet', ['exports', 'lodash/_ListCache', 'lodash/_Map', 'lodash/_MapCache'], function (exports, _ListCache, _Map, _MapCache) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _ListCache.default) {
      var pairs = data.__data__;
      if (!_Map.default || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new _MapCache.default(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  exports.default = stackSet;
});