define('lodash/wrapperReverse', ['exports', 'lodash/_LazyWrapper', 'lodash/_LodashWrapper', 'lodash/reverse', 'lodash/thru'], function (exports, _LazyWrapper, _LodashWrapper, _reverse, _thru) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is the wrapper version of `_.reverse`.
   *
   * **Note:** This method mutates the wrapped array.
   *
   * @name reverse
   * @memberOf _
   * @since 0.1.0
   * @category Seq
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var array = [1, 2, 3];
   *
   * _(array).reverse().value()
   * // => [3, 2, 1]
   *
   * console.log(array);
   * // => [3, 2, 1]
   */
  function wrapperReverse() {
    var value = this.__wrapped__;
    if (value instanceof _LazyWrapper.default) {
      var wrapped = value;
      if (this.__actions__.length) {
        wrapped = new _LazyWrapper.default(this);
      }
      wrapped = wrapped.reverse();
      wrapped.__actions__.push({
        'func': _thru.default,
        'args': [_reverse.default],
        'thisArg': undefined
      });
      return new _LodashWrapper.default(wrapped, this.__chain__);
    }
    return this.thru(_reverse.default);
  }

  exports.default = wrapperReverse;
});