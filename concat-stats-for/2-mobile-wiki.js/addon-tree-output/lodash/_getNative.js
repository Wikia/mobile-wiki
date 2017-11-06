define('lodash/_getNative', ['exports', 'lodash/_baseIsNative', 'lodash/_getValue'], function (exports, _baseIsNative, _getValue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `null`.
   */
  function getNative(object, key) {
    var value = (0, _getValue.default)(object, key);
    return (0, _baseIsNative.default)(value) ? value : null;
  }

  exports.default = getNative;
});