define('mobile-wiki/helpers/equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Helper.helper(function (params) {
    return params[0] === params[1];
  });
});