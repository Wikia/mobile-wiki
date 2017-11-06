define('lodash/_hashClear', ['exports', 'lodash/_nativeCreate'], function (exports, _nativeCreate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = _nativeCreate.default ? (0, _nativeCreate.default)(null) : {};
    this.size = 0;
  }

  exports.default = hashClear;
});