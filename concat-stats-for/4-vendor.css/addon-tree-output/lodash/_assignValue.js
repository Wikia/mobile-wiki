define('lodash/_assignValue', ['exports', 'lodash/_baseAssignValue', 'lodash/eq'], function (exports, _baseAssignValue, _eq) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && (0, _eq.default)(objValue, value)) || value === undefined && !(key in object)) {
      (0, _baseAssignValue.default)(object, key, value);
    }
  }

  exports.default = assignValue;
});