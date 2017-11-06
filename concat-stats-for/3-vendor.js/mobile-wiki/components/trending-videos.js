define('mobile-wiki/components/trending-videos', ['exports', 'mobile-wiki/models/media'], function (exports, _media) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    getOwner = Ember.getOwner;
	exports.default = Component.extend({
		classNames: ['trending', 'trending-videos', 'mw-content'],

		actions: {
			/**
    * @param {*} video
    * @returns {void}
    */
			openLightbox: function openLightbox(video) {
				var mediaModel = _media.default.create(getOwner(this).ownerInjection(), {
					media: video
				});

				this.sendAction('openLightbox', 'media', {
					media: mediaModel,
					mediaRef: 0
				});
			}
		}
	});
});