define('mobile-wiki/components/wikia-users', ['exports', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/utils/track'], function (exports, _thumbnailer, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		avatarHeight: 100,
		avatarWidth: 100,
		classNameBindings: ['classes'],
		isVisible: Ember.computed.notEmpty('users'),
		label: null,
		limit: 5,
		thumbMode: _thumbnailer.default.mode.fixedAspectRatio,
		trackingEvent: null,
		users: [],

		actions: {
			trackClick: function trackClick(category, label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: label
				});
			}
		}
	});
});