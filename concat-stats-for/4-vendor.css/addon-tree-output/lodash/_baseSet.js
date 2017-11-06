define('lodash/_baseSet', ['exports', 'lodash/_assignValue', 'lodash/_castPath', 'lodash/_isIndex', 'lodash/isObject', 'lodash/_toKey'], function (exports, _assignValue, _castPath, _isIndex, _isObject, _toKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.set`.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {Array|string} path The path of the property to set.
   * @param {*} value The value to set.
   * @param {Function} [customizer] The function to customize path creation.
   * @returns {Object} Returns `object`.
   */
  function baseSet(object, path, value, customizer) {
    if (!(0, _isObject.default)(object)) {
      return object;
    }
    path = (0, _castPath.default)(path, object);

    var index = -1,
        length = path.length,
        lastIndex = length - 1,
        nested = object;

    while (nested != null && ++index < length) {
      var key = (0, _toKey.default)(path[index]),
          newValue = value;

      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : undefined;
        if (newValue === undefined) {
          newValue = (0, _isObject.default)(objValue) ? objValue : (0, _isIndex.default)(path[index + 1]) ? [] : {};
        }
      }
      (0, _assignValue.default)(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }

  exports.default = baseSet;
});