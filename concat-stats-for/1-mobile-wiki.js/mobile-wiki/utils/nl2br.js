define('mobile-wiki/utils/nl2br', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (rawContent) {
    return rawContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
  };
});