define('lodash/_createToPairs', ['exports', 'lodash/_baseToPairs', 'lodash/_getTag', 'lodash/_mapToArray', 'lodash/_setToPairs'], function (exports, _baseToPairs, _getTag, _mapToArray, _setToPairs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var mapTag = '[object Map]',
      setTag = '[object Set]';

  /**
   * Creates a `_.toPairs` or `_.toPairsIn` function.
   *
   * @private
   * @param {Function} keysFunc The function to get the keys of a given object.
   * @returns {Function} Returns the new pairs function.
   */
  function createToPairs(keysFunc) {
    return function (object) {
      var tag = (0, _getTag.default)(object);
      if (tag == mapTag) {
        return (0, _mapToArray.default)(object);
      }
      if (tag == setTag) {
        return (0, _setToPairs.default)(object);
      }
      return (0, _baseToPairs.default)(object, keysFunc(object));
    };
  }

  exports.default = createToPairs;
});