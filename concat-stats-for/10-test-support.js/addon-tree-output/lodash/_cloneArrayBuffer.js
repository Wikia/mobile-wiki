define('lodash/_cloneArrayBuffer', ['exports', 'lodash/_Uint8Array'], function (exports, _Uint8Array) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new _Uint8Array.default(result).set(new _Uint8Array.default(arrayBuffer));
    return result;
  }

  exports.default = cloneArrayBuffer;
});