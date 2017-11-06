define('lodash/_getMapData', ['exports', 'lodash/_isKeyable'], function (exports, _isKeyable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return (0, _isKeyable.default)(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }

  exports.default = getMapData;
});