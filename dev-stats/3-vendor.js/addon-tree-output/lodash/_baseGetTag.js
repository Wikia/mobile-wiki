define('lodash/_baseGetTag', ['exports', 'lodash/_Symbol', 'lodash/_getRawTag', 'lodash/_objectToString'], function (exports, _Symbol2, _getRawTag, _objectToString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = _Symbol2.default ? _Symbol2.default.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? (0, _getRawTag.default)(value) : (0, _objectToString.default)(value);
  }

  exports.default = baseGetTag;
});