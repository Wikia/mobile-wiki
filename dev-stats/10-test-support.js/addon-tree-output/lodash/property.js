define('lodash/property', ['exports', 'lodash/_baseProperty', 'lodash/_basePropertyDeep', 'lodash/_isKey', 'lodash/_toKey'], function (exports, _baseProperty, _basePropertyDeep, _isKey, _toKey) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return (0, _isKey.default)(path) ? (0, _baseProperty.default)((0, _toKey.default)(path)) : (0, _basePropertyDeep.default)(path);
  }

  exports.default = property;
});