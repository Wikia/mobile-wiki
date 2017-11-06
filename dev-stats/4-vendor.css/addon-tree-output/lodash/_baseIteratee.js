define('lodash/_baseIteratee', ['exports', 'lodash/_baseMatches', 'lodash/_baseMatchesProperty', 'lodash/identity', 'lodash/isArray', 'lodash/property'], function (exports, _baseMatches, _baseMatchesProperty, _identity, _isArray, _property) {
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
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return _identity.default;
    }
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
      return (0, _isArray.default)(value) ? (0, _baseMatchesProperty.default)(value[0], value[1]) : (0, _baseMatches.default)(value);
    }
    return (0, _property.default)(value);
  }

  exports.default = baseIteratee;
});