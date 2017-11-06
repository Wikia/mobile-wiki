define('lodash/_initCloneObject', ['exports', 'lodash/_baseCreate', 'lodash/_getPrototype', 'lodash/_isPrototype'], function (exports, _baseCreate, _getPrototype, _isPrototype) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return typeof object.constructor == 'function' && !(0, _isPrototype.default)(object) ? (0, _baseCreate.default)((0, _getPrototype.default)(object)) : {};
  }

  exports.default = initCloneObject;
});