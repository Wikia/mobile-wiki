define('lodash/_copySymbolsIn', ['exports', 'lodash/_copyObject', 'lodash/_getSymbolsIn'], function (exports, _copyObject, _getSymbolsIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Copies own and inherited symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbolsIn(source, object) {
    return (0, _copyObject.default)(source, (0, _getSymbolsIn.default)(source), object);
  }

  exports.default = copySymbolsIn;
});