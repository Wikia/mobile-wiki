define('lodash/_getData', ['exports', 'lodash/_metaMap', 'lodash/noop'], function (exports, _metaMap, _noop) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets metadata for `func`.
   *
   * @private
   * @param {Function} func The function to query.
   * @returns {*} Returns the metadata for `func`.
   */
  var getData = !_metaMap.default ? _noop.default : function (func) {
    return _metaMap.default.get(func);
  };

  exports.default = getData;
});