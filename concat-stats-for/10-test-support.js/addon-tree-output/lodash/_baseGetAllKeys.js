define('lodash/_baseGetAllKeys', ['exports', 'lodash/_arrayPush', 'lodash/isArray'], function (exports, _arrayPush, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return (0, _isArray.default)(object) ? result : (0, _arrayPush.default)(result, symbolsFunc(object));
  }

  exports.default = baseGetAllKeys;
});