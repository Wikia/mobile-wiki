define('mobile-wiki/components/fastboot-only/tracking-pixels', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var reads = Ember.computed.reads;
	var Component = Ember.Component;
	exports.default = Component.extend({
		tagName: '',
		tracking: service(),
		comscore: reads('tracking.config.comscore'),
		quantcast: reads('tracking.config.quantcast')
	});
});