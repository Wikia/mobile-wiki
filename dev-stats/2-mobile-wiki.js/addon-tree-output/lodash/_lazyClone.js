define('lodash/_lazyClone', ['exports', 'lodash/_LazyWrapper', 'lodash/_copyArray'], function (exports, _LazyWrapper, _copyArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a clone of the lazy wrapper object.
   *
   * @private
   * @name clone
   * @memberOf LazyWrapper
   * @returns {Object} Returns the cloned `LazyWrapper` object.
   */
  function lazyClone() {
    var result = new _LazyWrapper.default(this.__wrapped__);
    result.__actions__ = (0, _copyArray.default)(this.__actions__);
    result.__dir__ = this.__dir__;
    result.__filtered__ = this.__filtered__;
    result.__iteratees__ = (0, _copyArray.default)(this.__iteratees__);
    result.__takeCount__ = this.__takeCount__;
    result.__views__ = (0, _copyArray.default)(this.__views__);
    return result;
  }

  exports.default = lazyClone;
});