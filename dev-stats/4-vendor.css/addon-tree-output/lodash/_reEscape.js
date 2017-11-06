define("lodash/_reEscape", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g;

  exports.default = reEscape;
});