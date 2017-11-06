define('lodash/_baseIsSet', ['exports', 'lodash/_getTag', 'lodash/isObjectLike'], function (exports, _getTag, _isObjectLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var setTag = '[object Set]';

  /**
   * The base implementation of `_.isSet` without Node optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   */
  function baseIsSet(value) {
    return (0, _isObjectLike.default)(value) && (0, _getTag.default)(value) == setTag;
  }

  exports.default = baseIsSet;
});