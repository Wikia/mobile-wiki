define('lodash/omit', ['exports', 'lodash/_arrayMap', 'lodash/_baseClone', 'lodash/_baseUnset', 'lodash/_castPath', 'lodash/_copyObject', 'lodash/_customOmitClone', 'lodash/_flatRest', 'lodash/_getAllKeysIn'], function (exports, _arrayMap, _baseClone, _baseUnset, _castPath, _copyObject, _customOmitClone, _flatRest, _getAllKeysIn) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /**
   * The opposite of `_.pick`; this method creates an object composed of the
   * own and inherited enumerable property paths of `object` that are not omitted.
   *
   * **Note:** This method is considerably slower than `_.pick`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The source object.
   * @param {...(string|string[])} [paths] The property paths to omit.
   * @returns {Object} Returns the new object.
   * @example
   *
   * var object = { 'a': 1, 'b': '2', 'c': 3 };
   *
   * _.omit(object, ['a', 'c']);
   * // => { 'b': '2' }
   */
  var omit = (0, _flatRest.default)(function (object, paths) {
    var result = {};
    if (object == null) {
      return result;
    }
    var isDeep = false;
    paths = (0, _arrayMap.default)(paths, function (path) {
      path = (0, _castPath.default)(path, object);
      isDeep || (isDeep = path.length > 1);
      return path;
    });
    (0, _copyObject.default)(object, (0, _getAllKeysIn.default)(object), result);
    if (isDeep) {
      result = (0, _baseClone.default)(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, _customOmitClone.default);
    }
    var length = paths.length;
    while (length--) {
      (0, _baseUnset.default)(result, paths[length]);
    }
    return result;
  });

  exports.default = omit;
});