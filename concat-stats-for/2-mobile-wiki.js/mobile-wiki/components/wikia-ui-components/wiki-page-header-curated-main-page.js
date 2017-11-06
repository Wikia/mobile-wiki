define('mobile-wiki/components/wikia-ui-components/wiki-page-header-curated-main-page', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var reads = Ember.computed.reads;
	var Component = Ember.Component;
	exports.default = Component.extend({
		wikiVariables: service(),
		classNames: ['wiki-page-header-curated-main-page'],
		siteName: reads('wikiVariables.siteName'),
		mainPageTitle: reads('wikiVariables.mainPageTitle'),

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