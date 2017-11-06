define("mobile-wiki/templates/components/category-members-grouped", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "VuXm4dpy", "block": "{\"symbols\":[\"firstLetter\",\"members\",\"category\"],\"statements\":[[4,\"if\",[[19,0,[\"prevPage\"]]],null,{\"statements\":[[0,\"\\t\"],[6,\"div\"],[9,\"class\",\"category-navigation\"],[7],[0,\"\\n\\t\\t\"],[1,[25,\"wds-spinner\",null,[[\"active\",\"overlay\",\"radius\",\"strokeWidth\"],[true,false,16,2]]],false],[0,\"\\n\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[18,\"prevPageUrl\"]]]],[9,\"class\",\"wds-button wds-is-secondary wds-is-full-width category-navigation__button category-navigation__prev\"],[3,\"action\",[[19,0,[]],\"loadPage\",[19,0,[\"prevPage\"]],\"previous\"]],[7],[0,\"\\n\\t\\t\\t\"],[1,[25,\"i18n\",[\"category-page.load-previous\"],null],false],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"each\",[[25,\"-each-in\",[[19,0,[\"membersGrouped\"]]],null]],null,{\"statements\":[[0,\"\\t\"],[6,\"div\"],[7],[0,\"\\n\\t\\t\"],[6,\"h3\"],[7],[1,[19,1,[]],false],[8],[0,\"\\n\\t\\t\"],[6,\"ul\"],[9,\"class\",\"category-members-grouped__list wds-has-big-items wds-list mw-content\"],[7],[0,\"\\n\"],[4,\"each\",[[19,2,[]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"li\"],[10,\"class\",[26,[[25,\"if\",[[19,3,[\"isCategory\"]],\"category-members-grouped__subcategory\"],null]]]],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[19,3,[\"url\"]]]]],[3,\"action\",[[19,0,[]],\"trackClick\",\"category-page\",\"open-link\"]],[7],[1,[19,3,[\"title\"]],false],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},{\"statements\":[[0,\"\\t\"],[6,\"div\"],[7],[1,[25,\"i18n\",[\"category-page.no-members\"],null],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[4,\"if\",[[19,0,[\"nextPage\"]]],null,{\"statements\":[[0,\"\\t\"],[6,\"div\"],[9,\"class\",\"category-navigation\"],[7],[0,\"\\n\\t\\t\"],[1,[25,\"wds-spinner\",null,[[\"active\",\"overlay\",\"radius\",\"strokeWidth\"],[true,false,16,2]]],false],[0,\"\\n\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[18,\"nextPageUrl\"]]]],[9,\"class\",\"wds-button wds-is-secondary wds-is-full-width category-navigation__button category-navigation__next\"],[3,\"action\",[[19,0,[]],\"loadPage\",[19,0,[\"nextPage\"]],\"next\"]],[7],[0,\"\\n\\t\\t\\t\"],[1,[25,\"i18n\",[\"category-page.load-more\"],null],false],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[1,[25,\"alert-notifications\",null,[[\"alerts\"],[[19,0,[\"alertNotifications\"]]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "mobile-wiki/templates/components/category-members-grouped.hbs" } });
});