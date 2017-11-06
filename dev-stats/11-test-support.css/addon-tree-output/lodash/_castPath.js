define('lodash/_castPath', ['exports', 'lodash/isArray', 'lodash/_isKey', 'lodash/_stringToPath', 'lodash/toString'], function (exports, _isArray, _isKey, _stringToPath, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if ((0, _isArray.default)(value)) {
      return value;
    }
    return (0, _isKey.default)(value, object) ? [value] : (0, _stringToPath.default)((0, _toString.default)(value));
  }

  exports.default = castPath;
});