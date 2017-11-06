define('lodash/_getPrototype', ['exports', 'lodash/_overArg'], function (exports, _overArg) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Built-in value references. */
  var getPrototype = (0, _overArg.default)(Object.getPrototypeOf, Object);

  exports.default = getPrototype;
});