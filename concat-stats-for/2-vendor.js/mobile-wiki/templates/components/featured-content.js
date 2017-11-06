define("mobile-wiki/templates/components/featured-content", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "05WNOoTj", "block": "{\"symbols\":[\"item\",\"index\"],\"statements\":[[4,\"if\",[[20,[\"showChevrons\"]]],null,{\"statements\":[[0,\"\\t\"],[1,[25,\"svg\",[\"chevron-linked\"],[[\"viewBox\",\"class\"],[\"0 0 5 20\",\"chevron chevron-left\"]]],false],[0,\"\\n\\t\"],[1,[25,\"svg\",[\"chevron-linked\"],[[\"viewBox\",\"class\"],[\"0 0 5 20\",\"chevron chevron-right\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[1,[25,\"featured-content-item\",null,[[\"model\"],[[20,[\"currentItem\"]]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"hasMultipleItems\"]]],null,{\"statements\":[[0,\"\\t\"],[6,\"ul\"],[9,\"class\",\"featured-content-pagination dot-pagination\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"model\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[6,\"li\"],[10,\"data-index\",[26,[[19,2,[]]]]],[7],[6,\"span\"],[7],[8],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "mobile-wiki/templates/components/featured-content.hbs" } });
});