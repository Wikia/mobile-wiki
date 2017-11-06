define('lodash/_stackClear', ['exports', 'lodash/_ListCache'], function (exports, _ListCache) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new _ListCache.default();
    this.size = 0;
  }

  exports.default = stackClear;
});