define('lodash/_getMatchData', ['exports', 'lodash/_isStrictComparable', 'lodash/keys'], function (exports, _isStrictComparable, _keys) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = (0, _keys.default)(object),
        length = result.length;

    while (length--) {
      var key = result[length],
          value = object[key];

      result[length] = [key, value, (0, _isStrictComparable.default)(value)];
    }
    return result;
  }

  exports.default = getMatchData;
});