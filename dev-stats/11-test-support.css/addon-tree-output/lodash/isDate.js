define('lodash/isDate', ['exports', 'lodash/_baseIsDate', 'lodash/_baseUnary', 'lodash/_nodeUtil'], function (exports, _baseIsDate, _baseUnary, _nodeUtil) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Node helper references. */
  var nodeIsDate = _nodeUtil.default && _nodeUtil.default.isDate;

  /**
   * Checks if `value` is classified as a `Date` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
   * @example
   *
   * _.isDate(new Date);
   * // => true
   *
   * _.isDate('Mon April 23 2012');
   * // => false
   */
  var isDate = nodeIsDate ? (0, _baseUnary.default)(nodeIsDate) : _baseIsDate.default;

  exports.default = isDate;
});