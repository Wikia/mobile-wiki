define('mobile-wiki/mixins/wiki-page-controller', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var reads = Ember.computed.reads;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		wikiVariables: service(),

		mainPageTitle: reads('wikiVariables.mainPageTitle'),
		siteName: reads('wikiVariables.siteName')
	});
});