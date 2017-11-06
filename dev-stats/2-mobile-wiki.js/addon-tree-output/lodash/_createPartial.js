define('lodash/_createPartial', ['exports', 'lodash/_apply', 'lodash/_createCtor', 'lodash/_root'], function (exports, _apply, _createCtor, _root) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1;

  /**
   * Creates a function that wraps `func` to invoke it with the `this` binding
   * of `thisArg` and `partials` prepended to the arguments it receives.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} partials The arguments to prepend to those provided to
   *  the new function.
   * @returns {Function} Returns the new wrapped function.
   */
  function createPartial(func, bitmask, thisArg, partials) {
    var isBind = bitmask & WRAP_BIND_FLAG,
        Ctor = (0, _createCtor.default)(func);

    function wrapper() {
      var argsIndex = -1,
          argsLength = arguments.length,
          leftIndex = -1,
          leftLength = partials.length,
          args = Array(leftLength + argsLength),
          fn = this && this !== _root.default && this instanceof wrapper ? Ctor : func;

      while (++leftIndex < leftLength) {
        args[leftIndex] = partials[leftIndex];
      }
      while (argsLength--) {
        args[leftIndex++] = arguments[++argsIndex];
      }
      return (0, _apply.default)(fn, isBind ? thisArg : this, args);
    }
    return wrapper;
  }

  exports.default = createPartial;
});