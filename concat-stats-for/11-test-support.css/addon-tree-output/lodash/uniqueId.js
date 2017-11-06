define('lodash/uniqueId', ['exports', 'lodash/toString'], function (exports, _toString) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  /** Used to generate unique IDs. */
  var idCounter = 0;

  /**
   * Generates a unique ID. If `prefix` is given, the ID is appended to it.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {string} [prefix=''] The value to prefix the ID with.
   * @returns {string} Returns the unique ID.
   * @example
   *
   * _.uniqueId('contact_');
   * // => 'contact_104'
   *
   * _.uniqueId();
   * // => '105'
   */
  function uniqueId(prefix) {
    var id = ++idCounter;
    return (0, _toString.default)(prefix) + id;
  }

  exports.default = uniqueId;
});