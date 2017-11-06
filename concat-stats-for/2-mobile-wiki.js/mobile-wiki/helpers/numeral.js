define('mobile-wiki/helpers/numeral', ['exports', 'numeral'], function (exports, _numeral) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;
  exports.default = helper(function (params) {
    var numberToFormat = params[0],
        format = params[1];

    return (0, _numeral.default)(numberToFormat).format(format);
  });
});