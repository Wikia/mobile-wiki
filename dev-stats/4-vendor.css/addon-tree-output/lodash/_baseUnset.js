define('lodash/_baseUnset', ['exports', 'lodash/_castPath', 'lodash/last', 'lodash/_parent', 'lodash/_toKey'], function (exports, _castPath, _last, _parent, _toKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.unset`.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {Array|string} path The property path to unset.
   * @returns {boolean} Returns `true` if the property is deleted, else `false`.
   */
  function baseUnset(object, path) {
    path = (0, _castPath.default)(path, object);
    object = (0, _parent.default)(object, path);
    return object == null || delete object[(0, _toKey.default)((0, _last.default)(path))];
  }

  exports.default = baseUnset;
});