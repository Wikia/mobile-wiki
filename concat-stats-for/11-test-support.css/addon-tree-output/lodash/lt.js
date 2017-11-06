define('lodash/lt', ['exports', 'lodash/_baseLt', 'lodash/_createRelationalOperation'], function (exports, _baseLt, _createRelationalOperation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if `value` is less than `other`.
   *
   * @static
   * @memberOf _
   * @since 3.9.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if `value` is less than `other`,
   *  else `false`.
   * @see _.gt
   * @example
   *
   * _.lt(1, 3);
   * // => true
   *
   * _.lt(3, 3);
   * // => false
   *
   * _.lt(3, 1);
   * // => false
   */
  var lt = (0, _createRelationalOperation.default)(_baseLt.default);

  exports.default = lt;
});