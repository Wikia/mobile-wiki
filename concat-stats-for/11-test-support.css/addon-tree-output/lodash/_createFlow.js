define('lodash/_createFlow', ['exports', 'lodash/_LodashWrapper', 'lodash/_flatRest', 'lodash/_getData', 'lodash/_getFuncName', 'lodash/isArray', 'lodash/_isLaziable'], function (exports, _LodashWrapper, _flatRest, _getData, _getFuncName, _isArray, _isLaziable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to compose bitmasks for function metadata. */
  var WRAP_CURRY_FLAG = 8,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256;

  /**
   * Creates a `_.flow` or `_.flowRight` function.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new flow function.
   */
  function createFlow(fromRight) {
    return (0, _flatRest.default)(function (funcs) {
      var length = funcs.length,
          index = length,
          prereq = _LodashWrapper.default.prototype.thru;

      if (fromRight) {
        funcs.reverse();
      }
      while (index--) {
        var func = funcs[index];
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (prereq && !wrapper && (0, _getFuncName.default)(func) == 'wrapper') {
          var wrapper = new _LodashWrapper.default([], true);
        }
      }
      index = wrapper ? index : length;
      while (++index < length) {
        func = funcs[index];

        var funcName = (0, _getFuncName.default)(func),
            data = funcName == 'wrapper' ? (0, _getData.default)(func) : undefined;

        if (data && (0, _isLaziable.default)(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
          wrapper = wrapper[(0, _getFuncName.default)(data[0])].apply(wrapper, data[3]);
        } else {
          wrapper = func.length == 1 && (0, _isLaziable.default)(func) ? wrapper[funcName]() : wrapper.thru(func);
        }
      }
      return function () {
        var args = arguments,
            value = args[0];

        if (wrapper && args.length == 1 && (0, _isArray.default)(value)) {
          return wrapper.plant(value).value();
        }
        var index = 0,
            result = length ? funcs[index].apply(this, args) : value;

        while (++index < length) {
          result = funcs[index].call(this, result);
        }
        return result;
      };
    });
  }

  exports.default = createFlow;
});