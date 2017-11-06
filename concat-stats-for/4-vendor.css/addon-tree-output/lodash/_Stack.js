define('lodash/_Stack', ['exports', 'lodash/_ListCache', 'lodash/_stackClear', 'lodash/_stackDelete', 'lodash/_stackGet', 'lodash/_stackHas', 'lodash/_stackSet'], function (exports, _ListCache, _stackClear, _stackDelete, _stackGet, _stackHas, _stackSet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new _ListCache.default(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = _stackClear.default;
  Stack.prototype['delete'] = _stackDelete.default;
  Stack.prototype.get = _stackGet.default;
  Stack.prototype.has = _stackHas.default;
  Stack.prototype.set = _stackSet.default;

  exports.default = Stack;
});