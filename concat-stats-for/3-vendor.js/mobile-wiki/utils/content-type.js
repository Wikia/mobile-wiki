define('mobile-wiki/utils/content-type', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * Utility to store contentType for ajax calls
   */
  var form = 'application/x-www-form-urlencoded; charset=utf-8',
      json = 'application/json; charset=utf-8';

  exports.form = form;
  exports.json = json;
});