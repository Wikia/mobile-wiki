define('mobile-wiki/controllers/article-preview', ['exports', 'mobile-wiki/mixins/full-page', 'mobile-wiki/mixins/portable-infobox-hero-image'], function (exports, _fullPage, _portableInfoboxHeroImage) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller;
	exports.default = Controller.extend(_fullPage.default, _portableInfoboxHeroImage.default, {});
});