define('lodash/_baseValues', ['exports', 'lodash/_arrayMap'], function (exports, _arrayMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return (0, _arrayMap.default)(props, function (key) {
      return object[key];
    });
  }

  exports.default = baseValues;
});