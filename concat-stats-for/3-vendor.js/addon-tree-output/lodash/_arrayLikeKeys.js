define('lodash/_arrayLikeKeys', ['exports', 'lodash/_baseTimes', 'lodash/isArguments', 'lodash/isArray', 'lodash/isBuffer', 'lodash/_isIndex', 'lodash/isTypedArray'], function (exports, _baseTimes, _isArguments, _isArray, _isBuffer, _isIndex, _isTypedArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = (0, _isArray.default)(value),
        isArg = !isArr && (0, _isArguments.default)(value),
        isBuff = !isArr && !isArg && (0, _isBuffer.default)(value),
        isType = !isArr && !isArg && !isBuff && (0, _isTypedArray.default)(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? (0, _baseTimes.default)(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
      // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' ||
      // Node 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') ||
      // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
      // Skip index properties.
      (0, _isIndex.default)(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }

  exports.default = arrayLikeKeys;
});