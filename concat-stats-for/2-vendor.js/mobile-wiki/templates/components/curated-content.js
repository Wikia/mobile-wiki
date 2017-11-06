define("mobile-wiki/templates/components/curated-content", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "cmZ5X7oB", "block": "{\"symbols\":[\"item\"],\"statements\":[[1,[25,\"curated-content-section\",null,[[\"model\",\"shouldBeVisible\",\"openSection\"],[[19,0,[\"model\"]],[25,\"equal\",[[19,0,[\"activeLabel\"]],null],null],[25,\"action\",[[19,0,[]],\"openSection\"],null]]]],false],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"items\"]]],null,{\"statements\":[[4,\"if\",[[25,\"equal\",[[19,1,[\"type\"]],\"section\"],null]],null,{\"statements\":[[0,\"\\t\\t\"],[1,[25,\"curated-content-section\",null,[[\"shouldBeVisible\",\"model\",\"openSection\",\"closeSection\"],[[25,\"equal\",[[19,0,[\"activeLabel\"]],[19,1,[\"label\"]]],null],[19,1,[]],[25,\"action\",[[19,0,[]],\"openSection\"],null],[25,\"action\",[[19,0,[]],\"closeSection\"],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "mobile-wiki/templates/components/curated-content.hbs" } });
});