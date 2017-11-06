define('mobile-wiki/components/wikia-ui-components/wiki-page-header-curated-main-page', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    computed = Ember.computed,
	    inject = Ember.inject;
	exports.default = Component.extend({
		wikiVariables: inject.service(),
		classNames: ['wiki-page-header-curated-main-page'],
		siteName: computed.reads('wikiVariables.siteName'),
		mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),

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