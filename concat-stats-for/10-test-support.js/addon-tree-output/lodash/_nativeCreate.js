define('lodash/_nativeCreate', ['exports', 'lodash/_getNative'], function (exports, _getNative) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Built-in method references that are verified to be native. */
  var nativeCreate = (0, _getNative.default)(Object, 'create');

  exports.default = nativeCreate;
});