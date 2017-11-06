define('lodash/isMap', ['exports', 'lodash/_baseIsMap', 'lodash/_baseUnary', 'lodash/_nodeUtil'], function (exports, _baseIsMap, _baseUnary, _nodeUtil) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Node helper references. */
  var nodeIsMap = _nodeUtil.default && _nodeUtil.default.isMap;

  /**
   * Checks if `value` is classified as a `Map` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   * @example
   *
   * _.isMap(new Map);
   * // => true
   *
   * _.isMap(new WeakMap);
   * // => false
   */
  var isMap = nodeIsMap ? (0, _baseUnary.default)(nodeIsMap) : _baseIsMap.default;

  exports.default = isMap;
});