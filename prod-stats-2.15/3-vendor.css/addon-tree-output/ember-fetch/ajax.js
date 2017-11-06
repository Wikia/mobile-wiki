define('ember-fetch/ajax', ['exports', 'fetch'], function (exports, _fetch) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = ajax;
  function ajax() {
    return _fetch.default.apply(undefined, arguments).then(function (response) {
      if (response.ok) {
        return response.json();
      }

      throw response;
    });
  }
});