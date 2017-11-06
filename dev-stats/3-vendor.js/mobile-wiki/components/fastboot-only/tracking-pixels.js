define('mobile-wiki/components/fastboot-only/tracking-pixels', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    computed = Ember.computed,
	    inject = Ember.inject;
	exports.default = Component.extend({
		tagName: '',
		tracking: inject.service(),
		comscore: computed.reads('tracking.config.comscore'),
		quantcast: computed.reads('tracking.config.quantcast')
	});
});