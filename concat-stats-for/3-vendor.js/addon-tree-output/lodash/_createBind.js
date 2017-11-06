define('lodash/_createBind', ['exports', 'lodash/_createCtor', 'lodash/_root'], function (exports, _createCtor, _root) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1;

  /**
   * Creates a function that wraps `func` to invoke it with the optional `this`
   * binding of `thisArg`.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createBind(func, bitmask, thisArg) {
    var isBind = bitmask & WRAP_BIND_FLAG,
        Ctor = (0, _createCtor.default)(func);

    function wrapper() {
      var fn = this && this !== _root.default && this instanceof wrapper ? Ctor : func;
      return fn.apply(isBind ? thisArg : this, arguments);
    }
    return wrapper;
  }

  exports.default = createBind;
});