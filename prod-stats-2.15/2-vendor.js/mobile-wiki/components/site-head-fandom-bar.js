define('mobile-wiki/components/site-head-fandom-bar', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    computed = Ember.computed;
	exports.default = Component.extend({
		classNames: ['site-head-fandom-bar-wrapper'],

		partnerSlot: computed.alias('globalNavigation.partner_slot'),
		svgName: computed.alias('globalNavigation.logo.module.tagline.image-data.name'),

		actions: {
			trackClick: function trackClick(label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'site-head',
					label: label
				});
			}
		}
	});
});