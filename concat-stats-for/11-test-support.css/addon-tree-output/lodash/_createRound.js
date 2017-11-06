define('lodash/_createRound', ['exports', 'lodash/toInteger', 'lodash/toNumber', 'lodash/toString'], function (exports, _toInteger, _toNumber, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMin = Math.min;

  /**
   * Creates a function like `_.round`.
   *
   * @private
   * @param {string} methodName The name of the `Math` method to use when rounding.
   * @returns {Function} Returns the new round function.
   */
  function createRound(methodName) {
    var func = Math[methodName];
    return function (number, precision) {
      number = (0, _toNumber.default)(number);
      precision = precision == null ? 0 : nativeMin((0, _toInteger.default)(precision), 292);
      if (precision) {
        // Shift with exponential notation to avoid floating-point issues.
        // See [MDN](https://mdn.io/round#Examples) for more details.
        var pair = ((0, _toString.default)(number) + 'e').split('e'),
            value = func(pair[0] + 'e' + (+pair[1] + precision));

        pair = ((0, _toString.default)(value) + 'e').split('e');
        return +(pair[0] + 'e' + (+pair[1] - precision));
      }
      return func(number);
    };
  }

  exports.default = createRound;
});