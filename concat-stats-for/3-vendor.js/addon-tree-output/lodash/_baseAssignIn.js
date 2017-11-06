define('lodash/_baseAssignIn', ['exports', 'lodash/_copyObject', 'lodash/keysIn'], function (exports, _copyObject, _keysIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.assignIn` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssignIn(object, source) {
    return object && (0, _copyObject.default)(source, (0, _keysIn.default)(source), object);
  }

  exports.default = baseAssignIn;
});