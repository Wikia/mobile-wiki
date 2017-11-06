define('lodash/_copySymbols', ['exports', 'lodash/_copyObject', 'lodash/_getSymbols'], function (exports, _copyObject, _getSymbols) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Copies own symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbols(source, object) {
    return (0, _copyObject.default)(source, (0, _getSymbols.default)(source), object);
  }

  exports.default = copySymbols;
});