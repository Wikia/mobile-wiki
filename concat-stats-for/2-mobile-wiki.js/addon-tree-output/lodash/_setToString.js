define('lodash/_setToString', ['exports', 'lodash/_baseSetToString', 'lodash/_shortOut'], function (exports, _baseSetToString, _shortOut) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = (0, _shortOut.default)(_baseSetToString.default);

  exports.default = setToString;
});