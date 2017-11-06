define("mobile-wiki/templates/components/article-comment", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "oIq4ZEyb", "block": "{\"symbols\":[\"comment\"],\"statements\":[[6,\"div\"],[9,\"class\",\"avatar\"],[7],[0,\"\\n\\t\"],[6,\"img\"],[10,\"src\",[26,[[25,\"unbound\",[[19,0,[\"user\",\"avatar\"]]],null]]]],[9,\"width\",\"50px\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"content\"],[7],[0,\"\\n\\t\"],[6,\"span\"],[9,\"class\",\"timestamp\"],[10,\"title\",[26,[[25,\"timestamp-to-date\",[[19,0,[\"comment\",\"created\"]]],null]]]],[7],[0,\"\\n\\t\\t\"],[1,[25,\"time-ago\",[[19,0,[\"comment\",\"created\"]]],null],false],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"span\"],[9,\"class\",\"username\"],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"user\",\"url\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[25,\"unbound\",[[19,0,[\"user\",\"url\"]]],null]]]],[7],[1,[25,\"unbound\",[[19,0,[\"userName\"]]],null],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\t\\t\\t\"],[1,[25,\"unbound\",[[19,0,[\"userName\"]]],null],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\t\"],[8],[0,\"\\n\\t\"],[1,[18,\"text\"],true],[0,\"\\n\"],[4,\"if\",[[19,0,[\"comment\",\"comments\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[6,\"button\"],[9,\"class\",\"show-reply-btn\"],[3,\"action\",[[19,0,[]],\"toggleExpand\"]],[7],[0,\"\\n\\t\\t\\t\"],[1,[25,\"i18n\",[\"article.replies-label\"],[[\"count\"],[[19,0,[\"comment\",\"comments\",\"length\"]]]]],false],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"ul\"],[10,\"class\",[26,[[25,\"if\",[[19,0,[\"isExpanded\"]],\"expanded\"],null]]]],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"comment\",\"comments\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[1,[25,\"article-comment\",null,[[\"comment\",\"users\"],[[19,1,[]],[19,0,[\"users\"]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "mobile-wiki/templates/components/article-comment.hbs" } });
});