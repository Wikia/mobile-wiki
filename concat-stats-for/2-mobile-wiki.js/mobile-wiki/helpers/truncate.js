define('mobile-wiki/helpers/truncate', ['exports', 'mobile-wiki/utils/truncate'], function (exports, _truncate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;
  exports.default = helper(function (params) {
    var text = params[0],
        maxLength = params[1];

    return (0, _truncate.default)(text, maxLength);
  });
});