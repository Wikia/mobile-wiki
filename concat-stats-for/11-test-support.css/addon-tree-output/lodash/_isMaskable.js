define('lodash/_isMaskable', ['exports', 'lodash/_coreJsData', 'lodash/isFunction', 'lodash/stubFalse'], function (exports, _coreJsData, _isFunction, _stubFalse) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Checks if `func` is capable of being masked.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
   */
  var isMaskable = _coreJsData.default ? _isFunction.default : _stubFalse.default;

  exports.default = isMaskable;
});