define('lodash/_baseUpdate', ['exports', 'lodash/_baseGet', 'lodash/_baseSet'], function (exports, _baseGet, _baseSet) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.update`.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {Array|string} path The path of the property to update.
   * @param {Function} updater The function to produce the updated value.
   * @param {Function} [customizer] The function to customize path creation.
   * @returns {Object} Returns `object`.
   */
  function baseUpdate(object, path, updater, customizer) {
    return (0, _baseSet.default)(object, path, updater((0, _baseGet.default)(object, path)), customizer);
  }

  exports.default = baseUpdate;
});