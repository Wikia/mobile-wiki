define('lodash/_basePickBy', ['exports', 'lodash/_baseGet', 'lodash/_baseSet', 'lodash/_castPath'], function (exports, _baseGet, _baseSet, _castPath) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of  `_.pickBy` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The source object.
   * @param {string[]} paths The property paths to pick.
   * @param {Function} predicate The function invoked per property.
   * @returns {Object} Returns the new object.
   */
  function basePickBy(object, paths, predicate) {
    var index = -1,
        length = paths.length,
        result = {};

    while (++index < length) {
      var path = paths[index],
          value = (0, _baseGet.default)(object, path);

      if (predicate(value, path)) {
        (0, _baseSet.default)(result, (0, _castPath.default)(path, object), value);
      }
    }
    return result;
  }

  exports.default = basePickBy;
});