define('lodash/_basePropertyDeep', ['exports', 'lodash/_baseGet'], function (exports, _baseGet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function (object) {
      return (0, _baseGet.default)(object, path);
    };
  }

  exports.default = basePropertyDeep;
});