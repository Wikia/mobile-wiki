define('lodash/wrapperValue', ['exports', 'lodash/_baseWrapperValue'], function (exports, _baseWrapperValue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Executes the chain sequence to resolve the unwrapped value.
   *
   * @name value
   * @memberOf _
   * @since 0.1.0
   * @alias toJSON, valueOf
   * @category Seq
   * @returns {*} Returns the resolved unwrapped value.
   * @example
   *
   * _([1, 2, 3]).value();
   * // => [1, 2, 3]
   */
  function wrapperValue() {
    return (0, _baseWrapperValue.default)(this.__wrapped__, this.__actions__);
  }

  exports.default = wrapperValue;
});