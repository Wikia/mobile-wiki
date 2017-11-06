define('lodash/_createRange', ['exports', 'lodash/_baseRange', 'lodash/_isIterateeCall', 'lodash/toFinite'], function (exports, _baseRange, _isIterateeCall, _toFinite) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Creates a `_.range` or `_.rangeRight` function.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new range function.
   */
  function createRange(fromRight) {
    return function (start, end, step) {
      if (step && typeof step != 'number' && (0, _isIterateeCall.default)(start, end, step)) {
        end = step = undefined;
      }
      // Ensure the sign of `-0` is preserved.
      start = (0, _toFinite.default)(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = (0, _toFinite.default)(end);
      }
      step = step === undefined ? start < end ? 1 : -1 : (0, _toFinite.default)(step);
      return (0, _baseRange.default)(start, end, step, fromRight);
    };
  }

  exports.default = createRange;
});