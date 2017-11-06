define('mobile-wiki/controllers/wiki-page', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller;
	var controller = Ember.inject.controller;
	exports.default = Controller.extend({
		application: controller(),
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