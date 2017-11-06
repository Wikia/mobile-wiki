define('lodash/_lazyReverse', ['exports', 'lodash/_LazyWrapper'], function (exports, _LazyWrapper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Reverses the direction of lazy iteration.
   *
   * @private
   * @name reverse
   * @memberOf LazyWrapper
   * @returns {Object} Returns the new reversed `LazyWrapper` object.
   */
  function lazyReverse() {
    if (this.__filtered__) {
      var result = new _LazyWrapper.default(this);
      result.__dir__ = -1;
      result.__filtered__ = true;
    } else {
      result = this.clone();
      result.__dir__ *= -1;
    }
    return result;
  }

  exports.default = lazyReverse;
});