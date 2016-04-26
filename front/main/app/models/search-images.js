import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import request from 'ember-ajax/request';

/**
 * @typedef {Object} SearchImageResponse
 * @property {SearchImageResponseData} [response]
 * @property {*} [error]
 */

/**
 * @typedef {Object} SearchImageResponseData
 * @property {SearchImageResults} results
 * @property {number} limit
 * @property {number} batch
 */

/**
 * @typedef {Object} SearchImageResults
 * @property {SearchImagePhoto} photo
 */

/**
 * @typedef {Object} SearchImagePhoto
 * @property {number} batches
 * @property {SearchImagePhotoItem[]} items
 */

/**
 * @typedef {Object} SearchImagePhotoItem
 * @property {string} title
 * @property {string} type
 * @property {string} url
 * @property {string} width
 * @property {string} height
 * @property {number} id
 * @property {string} [thumbnailUrl]
 */

export default Ember.Object.extend({
	searchLimit: 24,
	nextBatch: 0,
	batches: 1,
	imageSize: 200,
	searchQuery: '',
	items: [],

	/**
	 * @param {SearchImagePhotoItem[]} fetchedImages
	 * @returns {void}
	 */
	setItems(fetchedImages) {
		const items = this.get('items');

		this.set('items',
			items.concat(
				/**
				 * @param {SearchImagePhotoItem} image
				 * @returns {SearchImagePhotoItem}
				 */
				fetchedImages.map((image) => {
					image.thumbnailUrl = Thumbnailer.getThumbURL(image.url, {
						mode: Thumbnailer.mode.topCrop,
						width: this.imageSize,
						height: this.imageSize
					});

					return image;
				})
			)
		);
	},

	hasNextBatch: Ember.computed('batches', 'nextBatch', function () {
		return this.get('batches') > this.get('nextBatch');
	}),

	/**
	 * @returns {Ember.RSVP.Promise<SearchImagePhotoItem[]>}
	 */
	next() {
		this.incrementProperty('nextBatch');

		return this.fetch()
			/**
			 * @param {SearchImageResponse} data
			 */
			.then((data) => {
				let items;

				if (data.error) {
					throw new Error(data.error);
				}

				items = Ember.get(data, 'response.results.photo.items');

				if (Ember.isEmpty(items)) {
					throw new Error({
						status: 404,
						statusText: 'empty'
					});
				}

				this.setItems(items);
				this.set('batches', data.response.results.photo.batches);

				return items;
			});
	},

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	fetch() {
		return request(M.buildUrl({path: '/api.php'}), {
			data: {
				format: 'json',
				action: 'apimediasearch',
				query: this.get('searchQuery'),
				type: 'photo',
				batch: this.get('nextBatch'),
				limit: this.searchLimit
			}
		});
	}
});
