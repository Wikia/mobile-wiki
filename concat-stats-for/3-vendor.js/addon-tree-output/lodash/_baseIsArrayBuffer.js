define('lodash/_baseIsArrayBuffer', ['exports', 'lodash/_baseGetTag', 'lodash/isObjectLike'], function (exports, _baseGetTag, _isObjectLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var arrayBufferTag = '[object ArrayBuffer]';

  /**
   * The base implementation of `_.isArrayBuffer` without Node optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
   */
  function baseIsArrayBuffer(value) {
    return (0, _isObjectLike.default)(value) && (0, _baseGetTag.default)(value) == arrayBufferTag;
  }

  exports.default = baseIsArrayBuffer;
});