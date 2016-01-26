import Ember from 'ember';

/**
 * @typedef {Object} CuratedContentItem
 * @property {string} label
 * @property {string} imageUrl
 * @property {string} type
 * @property {string} [url]
 * @property {string} [categoryName]
 * @property {number} [ns]
 * @property {CuratedContentItemImageCrop} [imageCrop]
 */

/**
 * @typedef {Object} CuratedContentItemImageCrop
 * @property {CuratedContentItemCropData} landscape
 * @property {CuratedContentItemCropData} square
 */

/**
 * @typedef {Object} CuratedContentItemCropData
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

const CuratedContentModel = Ember.Object.extend({
	title: null,
	type: null,
	items: [],
	offset: null
});

CuratedContentModel.reopenClass({
	/**
	 * @param {string} title
	 * @param {string} [type='section']
	 * @param {string|null} [offset=null]
	 * @returns {Ember.RSVP.Promise}
	 */
	find(title, type = 'section', offset = null) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const modelInstance = CuratedContentModel.create({
					title,
					type
				}),
				params = {};

			let url = `${M.prop('apiBase')}/main/`;

			url += `${type}/${title}`;

			if (offset) {
				params.offset = offset;
			}

			Ember.$.ajax({
				url,
				data: params,
				success: (data) => {
					modelInstance.setProperties({
						items: CuratedContentModel.sanitizeItems(data.items),
						offset: data.offset || null
					});
					resolve(modelInstance);
				},
				error: (data) => reject(data)
			});
		});
	},

	/**
	 * @param {CuratedContentModel} model
	 * @returns {Ember.RSVP.Promise}
	 */
	loadMore(model) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			// Category type is hardcoded because only Categories API supports offset.
			const newModelPromise = CuratedContentModel.find(model.get('title'), 'category', model.get('offset'));

			newModelPromise
				.then((newModel) => {
					model.items.pushObjects(newModel.items);
					model.set('offset', newModel.offset);
					resolve(model);
				})
				.catch(reject);
		});
	},

	/**
	 * @param {*} rawData
	 * @returns {CuratedContentItem[]}
	 */
	sanitizeItems(rawData) {
		let sanitizedItems = [];

		if (Ember.isArray(rawData)) {
			sanitizedItems = rawData.map((item) => {
				return this.sanitizeItem(item);
			});
		}

		return sanitizedItems;
	},

	/**
	 * @param {*} rawData
	 * @returns {CuratedContentItem}
	 */
	sanitizeItem(rawData) {
		let item,
			categoryName,
			url;

		if (rawData.type === 'section') {
			item = {
				label: rawData.title,
				imageUrl: rawData.image_url,
				type: 'section'
			};
		} else if (rawData.type === 'category') {
			// MercuryApi (categories for section) returns article_local_url, ArticlesApi (subcategories) returns url
			url = rawData.url ? rawData.url : rawData.article_local_url;

			// TODO (CONCF-914): article_local_url is sometimes encoded and sometimes not, to investigate
			try {
				categoryName = decodeURIComponent(url);
			} catch (error) {
				categoryName = url;
			}

			// Remove /wiki/
			categoryName = categoryName.replace(Ember.get(Mercury, 'wiki.articlePath'), '');

			// Remove Category: prefix
			categoryName = categoryName.substr(categoryName.indexOf(':') + 1);

			item = {
				label: rawData.label || rawData.title,
				imageUrl: rawData.image_url,
				type: 'category',
				categoryName
			};
		} else {
			item = {
				label: rawData.title,
				imageUrl: rawData.thumbnail,
				type: rawData.type,
				url: rawData.url
			};

			// ArticlesApi doesn't return type for blog posts so we need to look at the namespace
			if (Ember.isEmpty(rawData.type) && rawData.ns === 500) {
				item.type = 'blog';
			}
		}

		if (rawData.image_crop) {
			item.imageCrop = rawData.image_crop;
		}

		return item;
	}
});

export default CuratedContentModel;
