define("lodash/_reInterpolate", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /** Used to match template delimiters. */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  exports.default = reInterpolate;
});