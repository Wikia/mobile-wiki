define('lodash/_baseFunctions', ['exports', 'lodash/_arrayFilter', 'lodash/isFunction'], function (exports, _arrayFilter, _isFunction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.functions` which creates an array of
   * `object` function property names filtered from `props`.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The property names to filter.
   * @returns {Array} Returns the function names.
   */
  function baseFunctions(object, props) {
    return (0, _arrayFilter.default)(props, function (key) {
      return (0, _isFunction.default)(object[key]);
    });
  }

  exports.default = baseFunctions;
});