define('lodash/_isIterateeCall', ['exports', 'lodash/eq', 'lodash/isArrayLike', 'lodash/_isIndex', 'lodash/isObject'], function (exports, _eq, _isArrayLike, _isIndex, _isObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!(0, _isObject.default)(object)) {
      return false;
    }
    var type = typeof index === 'undefined' ? 'undefined' : _typeof(index);
    if (type == 'number' ? (0, _isArrayLike.default)(object) && (0, _isIndex.default)(index, object.length) : type == 'string' && index in object) {
      return (0, _eq.default)(object[index], value);
    }
    return false;
  }

  exports.default = isIterateeCall;
});