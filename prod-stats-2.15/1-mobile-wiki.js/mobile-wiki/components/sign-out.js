define('mobile-wiki/components/sign-out', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['wds-sign-out'],
		title: null,
		trackingCategory: null,
		trackingLabel: null,

		actions: {
			trackClick: function trackClick() {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: this.get('trackingCategory'),
					label: this.get('trackingLabel')
				});
			}
		}
	});
});