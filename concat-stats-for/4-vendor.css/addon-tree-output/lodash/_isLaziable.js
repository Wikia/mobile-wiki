define('lodash/_isLaziable', ['exports', 'lodash/_LazyWrapper', 'lodash/_getData', 'lodash/_getFuncName', 'lodash/wrapperLodash'], function (exports, _LazyWrapper, _getData, _getFuncName, _wrapperLodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if `func` has a lazy counterpart.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
   *  else `false`.
   */
  function isLaziable(func) {
    var funcName = (0, _getFuncName.default)(func),
        other = _wrapperLodash.default[funcName];

    if (typeof other != 'function' || !(funcName in _LazyWrapper.default.prototype)) {
      return false;
    }
    if (func === other) {
      return true;
    }
    var data = (0, _getData.default)(other);
    return !!data && func === data[0];
  }

  exports.default = isLaziable;
});