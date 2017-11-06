define('mobile-wiki/components/site-head-fandom-bar', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var alias = Ember.computed.alias;
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['site-head-fandom-bar-wrapper'],

		partnerSlot: alias('globalNavigation.partner_slot'),
		svgName: alias('globalNavigation.logo.module.tagline.image-data.name'),

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