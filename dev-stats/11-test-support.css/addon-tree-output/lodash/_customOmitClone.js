define('lodash/_customOmitClone', ['exports', 'lodash/isPlainObject'], function (exports, _isPlainObject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /**
   * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
   * objects.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {string} key The key of the property to inspect.
   * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
   */
  function customOmitClone(value) {
    return (0, _isPlainObject.default)(value) ? undefined : value;
  }

  exports.default = customOmitClone;
});