define('lodash/stubString', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * This method returns an empty string.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {string} Returns the empty string.
   * @example
   *
   * _.times(2, _.stubString);
   * // => ['', '']
   */
  function stubString() {
    return '';
  }

  exports.default = stubString;
});