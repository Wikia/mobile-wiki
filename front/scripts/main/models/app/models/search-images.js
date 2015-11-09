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

App.SearchImagesModel = Em.Object.extend({
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
					image.thumbnailUrl = Mercury.Modules.Thumbnailer.getThumbURL(image.url, {
						mode: Mercury.Modules.Thumbnailer.mode.topCrop,
						width: this.imageSize,
						height: this.imageSize
					});

					return image;
				})
			)
		);
	},

	hasNextBatch: Em.computed('batches', 'nextBatch', function () {
		return this.get('batches') > this.get('nextBatch');
	}),

	/**
	 * @returns {Em.RSVP.Promise<SearchImagePhotoItem[]>}
	 */
	next() {
		this.incrementProperty('nextBatch');

		return new Em.RSVP.Promise((resolve, reject) => {
			this.fetch()
				/**
				 * @param {SearchImageResponse} data
				 */
				.done((data) => {
					let items;

					if (data.error) {
						return reject(data.error);
					}

					items = Em.get(data, 'response.results.photo.items');

					if (Em.isEmpty(items)) {
						return reject({
							status: 404,
							statusText: 'empty'
						});
					}

					this.setItems(items);
					this.set('batches', data.response.results.photo.batches);

					resolve(items);
				})
				.fail(reject);
		});
	},

	/**
	 * @returns {JQueryXHR}
	 */
	fetch() {
		return Em.$.getJSON(
			M.buildUrl({
				path: '/api.php',
			}),
			{
				format: 'json',
				action: 'apimediasearch',
				query: this.get('searchQuery'),
				type: 'photo',
				batch: this.get('nextBatch'),
				limit: this.searchLimit
			}
		);
	}
});
