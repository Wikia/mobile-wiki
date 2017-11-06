define('lodash/_baseIsMap', ['exports', 'lodash/_getTag', 'lodash/isObjectLike'], function (exports, _getTag, _isObjectLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var mapTag = '[object Map]';

  /**
   * The base implementation of `_.isMap` without Node optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   */
  function baseIsMap(value) {
    return (0, _isObjectLike.default)(value) && (0, _getTag.default)(value) == mapTag;
  }

  exports.default = baseIsMap;
});