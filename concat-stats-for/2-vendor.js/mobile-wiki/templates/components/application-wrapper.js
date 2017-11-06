define("mobile-wiki/templates/components/application-wrapper", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "mP9NCqru", "block": "{\"symbols\":[\"@toggleSmartBanner\",\"@goToSearchResults\",\"@globalNavigation\",\"@loadRandomArticle\",\"@toggleDrawer\",\"@setQueryParam\",\"@closeLightbox\"],\"statements\":[[4,\"if\",[[20,[\"fullPage\"]]],null,{\"statements\":[[0,\"\\t\"],[1,[18,\"outlet\"],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\t\"],[1,[25,\"site-head\",null,[[\"drawerContent\",\"drawerVisible\",\"globalNavigation\",\"isFandomAppSmartBannerVisible\",\"isSearchPage\",\"shadow\",\"setDrawerContent\",\"shouldShowFandomAppSmartBanner\",\"smartBannerVisible\",\"themeBar\",\"toggleDrawer\",\"toggleSmartBannerVisibility\"],[[20,[\"activeDrawerContent\"]],[20,[\"drawerVisible\"]],[19,3,[]],[20,[\"isFandomAppSmartBannerVisible\"]],[20,[\"isSearchPage\"]],[20,[\"siteHeadShadow\"]],[25,\"action\",[[19,0,[]],\"setDrawerContent\"],null],[20,[\"shouldShowFandomAppSmartBanner\"]],[20,[\"smartBannerVisible\"]],[20,[\"themeBar\"]],[19,5,[]],[19,1,[]]]]],false],[0,\"\\n\"],[4,\"wikia-drawer\",null,[[\"shouldBeVisible\"],[[20,[\"drawerVisible\"]]]],{\"statements\":[[4,\"if\",[[20,[\"activeDrawerContent\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[1,[25,\"component\",[[20,[\"drawerContentComponent\"]]],[[\"onEnterHandler\",\"suggestionClickAction\",\"setDrawerContent\",\"closeDrawer\",\"outsideSuggestionsClickAction\",\"loadRandomArticle\",\"globalNavigation\",\"goToSearchResults\",\"noScroll\",\"focusInput\"],[[25,\"action\",[[19,0,[]],\"closeDrawer\"],null],[25,\"action\",[[19,0,[]],\"closeDrawer\"],null],[25,\"action\",[[19,0,[]],\"setDrawerContent\"],null],[25,\"action\",[[19,0,[]],\"closeDrawer\"],null],[25,\"action\",[[19,0,[]],\"closeDrawer\"],null],[19,4,[]],[19,3,[]],[19,2,[]],true,true]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"unless\",[[20,[\"shouldShowFandomAppSmartBanner\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[1,[25,\"smart-banner-android\",null,[[\"isVisible\",\"toggleVisibility\"],[[20,[\"smartBannerVisible\"]],[19,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\"],[6,\"div\"],[9,\"class\",\"page-wrapper row\"],[10,\"lang\",[20,[\"language\",\"content\"]],null],[10,\"dir\",[20,[\"language\",\"contentDir\"]],null],[7],[0,\"\\n\\t\\t\"],[1,[18,\"outlet\"],false],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[1,[25,\"lightbox-wrapper\",null,[[\"type\",\"model\",\"isVisible\",\"lightboxCloseButtonDelay\",\"closeLightbox\",\"setQueryParam\"],[[20,[\"lightboxType\"]],[20,[\"lightboxModel\"]],[20,[\"lightboxVisible\"]],[20,[\"lightboxCloseButtonDelay\"]],[19,7,[]],[19,6,[]]]]],false],[0,\"\\n\\t\"],[1,[18,\"wikia-in-your-lang\"],false],[0,\"\\n\"],[4,\"if\",[[20,[\"globalFooter\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[1,[25,\"global-footer/global-footer\",null,[[\"model\"],[[20,[\"globalFooter\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}],[1,[25,\"alert-notifications\",null,[[\"alerts\"],[[20,[\"alertNotifications\"]]]]],false],[0,\"\\n\"],[1,[25,\"wds-spinner\",null,[[\"active\"],[[20,[\"isLoading\"]]]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "mobile-wiki/templates/components/application-wrapper.hbs" } });
});