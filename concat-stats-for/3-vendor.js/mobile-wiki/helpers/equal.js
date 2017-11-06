define('mobile-wiki/helpers/equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;
  exports.default = helper(function (params) {
    return params[0] === params[1];
  });
});