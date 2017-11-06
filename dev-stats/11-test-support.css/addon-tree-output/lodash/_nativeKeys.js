define('lodash/_nativeKeys', ['exports', 'lodash/_overArg'], function (exports, _overArg) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = (0, _overArg.default)(Object.keys, Object);

  exports.default = nativeKeys;
});