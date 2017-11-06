define('lodash/_Hash', ['exports', 'lodash/_hashClear', 'lodash/_hashDelete', 'lodash/_hashGet', 'lodash/_hashHas', 'lodash/_hashSet'], function (exports, _hashClear, _hashDelete, _hashGet, _hashHas, _hashSet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = _hashClear.default;
  Hash.prototype['delete'] = _hashDelete.default;
  Hash.prototype.get = _hashGet.default;
  Hash.prototype.has = _hashHas.default;
  Hash.prototype.set = _hashSet.default;

  exports.default = Hash;
});