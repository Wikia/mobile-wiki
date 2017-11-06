define('lodash/isWeakMap', ['exports', 'lodash/_getTag', 'lodash/isObjectLike'], function (exports, _getTag, _isObjectLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var weakMapTag = '[object WeakMap]';

  /**
   * Checks if `value` is classified as a `WeakMap` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
   * @example
   *
   * _.isWeakMap(new WeakMap);
   * // => true
   *
   * _.isWeakMap(new Map);
   * // => false
   */
  function isWeakMap(value) {
    return (0, _isObjectLike.default)(value) && (0, _getTag.default)(value) == weakMapTag;
  }

  exports.default = isWeakMap;
});