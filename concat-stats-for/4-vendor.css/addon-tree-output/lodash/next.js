define('lodash/next', ['exports', 'lodash/toArray'], function (exports, _toArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the next value on a wrapped object following the
   * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
   *
   * @name next
   * @memberOf _
   * @since 4.0.0
   * @category Seq
   * @returns {Object} Returns the next iterator value.
   * @example
   *
   * var wrapped = _([1, 2]);
   *
   * wrapped.next();
   * // => { 'done': false, 'value': 1 }
   *
   * wrapped.next();
   * // => { 'done': false, 'value': 2 }
   *
   * wrapped.next();
   * // => { 'done': true, 'value': undefined }
   */
  function wrapperNext() {
    if (this.__values__ === undefined) {
      this.__values__ = (0, _toArray.default)(this.value());
    }
    var done = this.__index__ >= this.__values__.length,
        value = done ? undefined : this.__values__[this.__index__++];

    return { 'done': done, 'value': value };
  }

  exports.default = wrapperNext;
});