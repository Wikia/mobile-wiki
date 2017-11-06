define('mobile-wiki/components/global-footer/global-footer', ['exports', 'mobile-wiki/utils/track'], function (exports, _track2) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		tagName: '',

		actions: {
			track: function track(trackingLabel) {
				(0, _track2.track)({
					action: _track2.trackActions.click,
					category: 'footer',
					label: trackingLabel
				});
			}
		}
	});
});