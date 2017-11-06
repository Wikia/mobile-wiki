define('lodash/_basePick', ['exports', 'lodash/_basePickBy', 'lodash/hasIn'], function (exports, _basePickBy, _hasIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.pick` without support for individual
   * property identifiers.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} paths The property paths to pick.
   * @returns {Object} Returns the new object.
   */
  function basePick(object, paths) {
    return (0, _basePickBy.default)(object, paths, function (value, path) {
      return (0, _hasIn.default)(object, path);
    });
  }

  exports.default = basePick;
});