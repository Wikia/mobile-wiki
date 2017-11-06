define('lodash/defaultsDeep', ['exports', 'lodash/_apply', 'lodash/_baseRest', 'lodash/_customDefaultsMerge', 'lodash/mergeWith'], function (exports, _apply, _baseRest, _customDefaultsMerge, _mergeWith) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * This method is like `_.defaults` except that it recursively assigns
   * default properties.
   *
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 3.10.0
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object} Returns `object`.
   * @see _.defaults
   * @example
   *
   * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
   * // => { 'a': { 'b': 2, 'c': 3 } }
   */
  var defaultsDeep = (0, _baseRest.default)(function (args) {
    args.push(undefined, _customDefaultsMerge.default);
    return (0, _apply.default)(_mergeWith.default, undefined, args);
  });

  exports.default = defaultsDeep;
});