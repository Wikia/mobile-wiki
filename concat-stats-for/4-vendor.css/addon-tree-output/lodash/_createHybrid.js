define('lodash/_createHybrid', ['exports', 'lodash/_composeArgs', 'lodash/_composeArgsRight', 'lodash/_countHolders', 'lodash/_createCtor', 'lodash/_createRecurry', 'lodash/_getHolder', 'lodash/_reorder', 'lodash/_replaceHolders', 'lodash/_root'], function (exports, _composeArgs, _composeArgsRight, _countHolders, _createCtor, _createRecurry, _getHolder, _reorder, _replaceHolders, _root) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_ARY_FLAG = 128,
      WRAP_FLIP_FLAG = 512;

  /**
   * Creates a function that wraps `func` to invoke it with optional `this`
   * binding of `thisArg`, partial application, and currying.
   *
   * @private
   * @param {Function|string} func The function or method name to wrap.
   * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {Array} [partials] The arguments to prepend to those provided to
   *  the new function.
   * @param {Array} [holders] The `partials` placeholder indexes.
   * @param {Array} [partialsRight] The arguments to append to those provided
   *  to the new function.
   * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
   * @param {Array} [argPos] The argument positions of the new function.
   * @param {number} [ary] The arity cap of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new wrapped function.
   */
  function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
    var isAry = bitmask & WRAP_ARY_FLAG,
        isBind = bitmask & WRAP_BIND_FLAG,
        isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
        isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
        isFlip = bitmask & WRAP_FLIP_FLAG,
        Ctor = isBindKey ? undefined : (0, _createCtor.default)(func);

    function wrapper() {
      var length = arguments.length,
          args = Array(length),
          index = length;

      while (index--) {
        args[index] = arguments[index];
      }
      if (isCurried) {
        var placeholder = (0, _getHolder.default)(wrapper),
            holdersCount = (0, _countHolders.default)(args, placeholder);
      }
      if (partials) {
        args = (0, _composeArgs.default)(args, partials, holders, isCurried);
      }
      if (partialsRight) {
        args = (0, _composeArgsRight.default)(args, partialsRight, holdersRight, isCurried);
      }
      length -= holdersCount;
      if (isCurried && length < arity) {
        var newHolders = (0, _replaceHolders.default)(args, placeholder);
        return (0, _createRecurry.default)(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
      }
      var thisBinding = isBind ? thisArg : this,
          fn = isBindKey ? thisBinding[func] : func;

      length = args.length;
      if (argPos) {
        args = (0, _reorder.default)(args, argPos);
      } else if (isFlip && length > 1) {
        args.reverse();
      }
      if (isAry && ary < length) {
        args.length = ary;
      }
      if (this && this !== _root.default && this instanceof wrapper) {
        fn = Ctor || (0, _createCtor.default)(fn);
      }
      return fn.apply(thisBinding, args);
    }
    return wrapper;
  }

  exports.default = createHybrid;
});