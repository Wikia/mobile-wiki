define('mobile-wiki/models/media', ['exports', 'mobile-wiki/utils/string'], function (exports, _string) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object,
	    inject = Ember.inject,
	    isArray = Ember.isArray;
	exports.default = EmberObject.extend({
		logger: inject.service(),

		/**
   * In order to have consistency in input data we are wrapping them into array if they are not
   *
   * @returns {void}
   */
		init: function init() {
			var media = this.get('media');

			if (!isArray(media)) {
				this.set('media', [media]);
			}
		},


		/**
   * @param {number} id
   * @returns {ArticleMedia}
   */
		find: function find(id) {
			return this.get('media')[id];
		},


		/**
   * @param {string} title
   * @returns {LightboxMediaRefs}
   */
		getRefsForLightboxByTitle: function getRefsForLightboxByTitle(title) {
			var mediaRef = null,
			    galleryRef = null;

			var media = this.get('media'),

			/**
    * @param {ArticleMedia} galleryItem
    * @param {number}galleryIndex
    * @returns {boolean}
    */
			findInGallery = function findInGallery(galleryItem, galleryIndex) {
				if ((0, _string.normalizeToUnderscore)(galleryItem.title) === (0, _string.normalizeToUnderscore)(title)) {
					mediaRef = this.mediaIndex;
					galleryRef = galleryIndex;
					return true;
				}
				return false;
			},

			/**
    * @param {ArticleMedia|ArticleMedia[]} mediaItem
    * @param {number} mediaIndex
    * @returns {boolean}
    */
			findInMedia = function findInMedia(mediaItem, mediaIndex) {
				if (isArray(mediaItem)) {
					return mediaItem.some(findInGallery, {
						mediaIndex: mediaIndex
					});
				} else if ((0, _string.normalizeToUnderscore)(mediaItem.title) === (0, _string.normalizeToUnderscore)(title)) {
					mediaRef = mediaIndex;
					return true;
				}
			};

			if (isArray(media)) {
				media.some(findInMedia);
			} else {
				this.get('logger').debug('Media is not an array', media);
			}

			return {
				mediaRef: mediaRef,
				galleryRef: galleryRef
			};
		}
	});
});