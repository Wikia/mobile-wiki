define('lodash/_baseInvoke', ['exports', 'lodash/_apply', 'lodash/_castPath', 'lodash/last', 'lodash/_parent', 'lodash/_toKey'], function (exports, _apply, _castPath, _last, _parent, _toKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.invoke` without support for individual
   * method arguments.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the method to invoke.
   * @param {Array} args The arguments to invoke the method with.
   * @returns {*} Returns the result of the invoked method.
   */
  function baseInvoke(object, path, args) {
    path = (0, _castPath.default)(path, object);
    object = (0, _parent.default)(object, path);
    var func = object == null ? object : object[(0, _toKey.default)((0, _last.default)(path))];
    return func == null ? undefined : (0, _apply.default)(func, object, args);
  }

  exports.default = baseInvoke;
});