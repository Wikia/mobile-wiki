define('lodash/_baseAssign', ['exports', 'lodash/_copyObject', 'lodash/keys'], function (exports, _copyObject, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssign(object, source) {
    return object && (0, _copyObject.default)(source, (0, _keys.default)(source), object);
  }

  exports.default = baseAssign;
});