define('mobile-wiki/components/wikia-users', ['exports', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/utils/track'], function (exports, _thumbnailer, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var notEmpty = Ember.computed.notEmpty;
	var Component = Ember.Component;
	exports.default = Component.extend({
		avatarHeight: 100,
		avatarWidth: 100,
		classNameBindings: ['classes'],
		isVisible: notEmpty('users'),
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