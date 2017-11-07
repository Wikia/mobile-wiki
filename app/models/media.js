import {inject as service} from '@ember/service';
import EmberObject from '@ember/object';
import {isArray} from '@ember/array';
import {normalizeToUnderscore} from '../utils/string';

/**
 * @typedef {Object} ArticleMedia
 * @property {string} caption
 * @property {string} fileUrl
 * @property {number} height
 * @property {string} link
 * @property {string} title
 * @property {string} type
 * @property {string} url
 * @property {string} user
 * @property {string} width
 * @property {string} [context]
 */

/**
 * @typedef {Object} LightboxMediaRefs
 * @property {number} galleryRef
 * @property {number} mediaRef
 */

export default EmberObject.extend({
	logger: service(),

	/**
	 * In order to have consistency in input data we are wrapping them into array if they are not
	 *
	 * @returns {void}
	 */
	init() {
		const media = this.get('media');

		if (!isArray(media)) {
			this.set('media', [media]);
		}
	},

	/**
	 * @param {number} id
	 * @returns {ArticleMedia}
	 */
	find(id) {
		return this.get('media')[id];
	},

	/**
	 * @param {string} title
	 * @returns {LightboxMediaRefs}
	 */
	getRefsForLightboxByTitle(title) {
		let mediaRef = null,
			galleryRef = null;

		const media = this.get('media'),
			/**
			 * @param {ArticleMedia} galleryItem
			 * @param {number}galleryIndex
			 * @returns {boolean}
			 */
			findInGallery = function (galleryItem, galleryIndex) {
				if (normalizeToUnderscore(galleryItem.title) === normalizeToUnderscore(title)) {
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
			findInMedia = function (mediaItem, mediaIndex) {
				if (isArray(mediaItem)) {
					return (mediaItem).some(findInGallery, {
						mediaIndex
					});
				} else if (normalizeToUnderscore(mediaItem.title) === normalizeToUnderscore(title)) {
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
			mediaRef,
			galleryRef
		};
	},
});
