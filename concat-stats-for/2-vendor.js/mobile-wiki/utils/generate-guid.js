define('mobile-wiki/utils/generate-guid', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = generateGuid;
  /**
   * create unique string with prefix as a base of the string if passed
   *
   * @param {string} [prefix='']
   * @returns {string} unique string
   */
  function generateGuid() {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return '' + prefix + Date.now();
  }
});