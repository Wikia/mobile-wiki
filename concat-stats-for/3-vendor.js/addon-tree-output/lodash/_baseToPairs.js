define('lodash/_baseToPairs', ['exports', 'lodash/_arrayMap'], function (exports, _arrayMap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return (0, _arrayMap.default)(props, function (key) {
      return [key, object[key]];
    });
  }

  exports.default = baseToPairs;
});