define('lodash/_defineProperty', ['exports', 'lodash/_getNative'], function (exports, _getNative) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var defineProperty = function () {
    try {
      var func = (0, _getNative.default)(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {
      return null;
    }
  }();

  exports.default = defineProperty;
});