define('mobile-wiki/mixins/wiki-page-controller', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin,
	    computed = Ember.computed,
	    inject = Ember.inject;
	exports.default = Mixin.create({
		wikiVariables: inject.service(),

		mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
		siteName: computed.reads('wikiVariables.siteName')
	});
});