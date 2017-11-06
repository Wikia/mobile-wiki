define('mobile-wiki/components/wikia-stats', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Component = Ember.Component;
	var computed = Ember.computed;
	exports.default = Component.extend({
		classNames: ['wikia-stats'],
		i18n: service(),

		items: computed('model', function () {
			return [{
				label: this.get('i18n').t('app.pages-label'),
				value: this.get('model.articles')
			}, {
				label: this.get('i18n').t('app.photos-label'),
				value: this.get('model.images')
			}, {
				label: this.get('i18n').t('app.videos-label'),
				value: this.get('model.videos')
			}, {
				label: this.get('i18n').t('app.discussions-label'),
				url: '/d/f',
				trackingLabel: 'discussions-clicked',
				value: this.get('model.discussions')
			}];
		}),
		actions: {
			trackClick: function trackClick(trackingLabel) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'main-page',
					label: trackingLabel
				});
			}
		}
	});
});