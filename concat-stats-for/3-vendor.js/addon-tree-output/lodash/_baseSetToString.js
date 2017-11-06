define('lodash/_baseSetToString', ['exports', 'lodash/constant', 'lodash/_defineProperty', 'lodash/identity'], function (exports, _constant, _defineProperty, _identity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !_defineProperty.default ? _identity.default : function (func, string) {
    return (0, _defineProperty.default)(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': (0, _constant.default)(string),
      'writable': true
    });
  };

  exports.default = baseSetToString;
});