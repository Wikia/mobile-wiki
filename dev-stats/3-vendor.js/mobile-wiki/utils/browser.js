define('mobile-wiki/utils/browser', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Detects if user is using iOS or Android system
   *
   * @returns {string}
   */

  var userAgent = window.navigator && navigator.userAgent;

  var system = void 0,
      standalone = void 0;

  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    exports.system = system = 'ios';
  } else if (/Android/i.test(userAgent)) {
    exports.system = system = 'android';
  }

  exports.standalone = standalone = window.navigator && navigator.standalone;

  /**
   * Checks if current browser is Safari of version higher or equal to provided
   * @param {int} version Full version number without decimals
   * @returns {boolean}
   */
  function isSafariMinVer(version) {
    var pattern = /OS (\d+)/,
        match = window.navigator.userAgent.match(pattern);

    return match && parseInt(match[1], 10) >= version;
  }

  exports.isSafariMinVer = isSafariMinVer;
  exports.system = system;
  exports.standalone = standalone;
});