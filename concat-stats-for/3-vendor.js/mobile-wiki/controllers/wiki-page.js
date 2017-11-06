define('mobile-wiki/controllers/wiki-page', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		application: Ember.inject.controller(),
		actions: {
			/**
    *
    * @param {string} lightboxType
    * @param {*} lightboxModel
    * @param {number} closeButtonDelay
    */
			openLightbox: function openLightbox(lightboxType, lightboxModel, closeButtonDelay) {
				this.set('preserveScrollPosition', true);
				this.get('application').send('openLightbox', lightboxType, lightboxModel, closeButtonDelay);
			}
		}
	});
});