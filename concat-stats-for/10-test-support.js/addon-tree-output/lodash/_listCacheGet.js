define('lodash/_listCacheGet', ['exports', 'lodash/_assocIndexOf'], function (exports, _assocIndexOf) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = (0, _assocIndexOf.default)(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  exports.default = listCacheGet;
});