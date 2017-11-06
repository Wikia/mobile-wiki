define('lodash/_baseKeysIn', ['exports', 'lodash/isObject', 'lodash/_isPrototype', 'lodash/_nativeKeysIn'], function (exports, _isObject, _isPrototype, _nativeKeysIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!(0, _isObject.default)(object)) {
      return (0, _nativeKeysIn.default)(object);
    }
    var isProto = (0, _isPrototype.default)(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  exports.default = baseKeysIn;
});