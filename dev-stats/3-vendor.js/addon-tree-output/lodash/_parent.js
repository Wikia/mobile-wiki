define('lodash/_parent', ['exports', 'lodash/_baseGet', 'lodash/_baseSlice'], function (exports, _baseGet, _baseSlice) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the parent value at `path` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} path The path to get the parent value of.
   * @returns {*} Returns the parent value.
   */
  function parent(object, path) {
    return path.length < 2 ? object : (0, _baseGet.default)(object, (0, _baseSlice.default)(path, 0, -1));
  }

  exports.default = parent;
});