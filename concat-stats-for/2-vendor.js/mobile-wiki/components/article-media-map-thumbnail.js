define('mobile-wiki/components/article-media-map-thumbnail', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    inject = Ember.inject;
	exports.default = Component.extend({
		classNames: ['article-media-map-thumbnail'],
		tagName: 'figure',
		logger: inject.service(),

		/**
   * @returns {void|boolean}
   */
		click: function click() {
			var url = this.get('url'),
			    id = this.get('id'),
			    title = this.get('title');

			if (url) {
				this.get('logger').debug('Handling map with id:', id, 'and title:', title);

				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'map',
					label: 'open'
				});

				this.get('openLightbox')('map', {
					id: id,
					title: title,
					url: url
				});

				return false;
			}
		}
	});
});