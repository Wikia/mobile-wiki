define("lodash/_reEvaluate", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /** Used to match template delimiters. */
  var reEvaluate = /<%([\s\S]+?)%>/g;

  exports.default = reEvaluate;
});