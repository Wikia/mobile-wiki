define('mobile-wiki/helpers/shorten-large-number', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;
  exports.default = helper(function (params) {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        number = params[0],
        digits = params[1];

    for (var i = units.length - 1; i >= 0; i--) {
      var decimal = Math.pow(1000, i + 1);

      if (number <= -decimal || number >= decimal) {
        return Number(number / decimal).toFixed(digits) + units[i];
      }
    }

    return number.toString();
  });
});