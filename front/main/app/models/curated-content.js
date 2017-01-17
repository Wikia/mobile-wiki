import Ember from 'ember';

const {Object: EmberObject, isArray, isEmpty} = Ember;

/**
 * @typedef {Object} CuratedContentItem
 * @property {string} label
 * @property {string} imageUrl
 * @property {string} type
 * @property {string} [url]
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

const CuratedContentModel = EmberObject.extend({
	title: null,
	type: null,
	items: []
});

CuratedContentModel.reopenClass({
	/**
	 * @param {*} rawData
	 * @returns {CuratedContentItem[]}
	 */
	sanitizeItems(rawData) {
		let sanitizedItems = [];

		if (isArray(rawData)) {
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
		let item;

		if (rawData.type === 'section') {
			item = {
				label: rawData.title,
				imageUrl: rawData.image_url,
				type: 'section',
				items: CuratedContentModel.sanitizeItems(rawData.items)
			};
		} else if (rawData.type === 'category') {
			item = {
				label: rawData.label || rawData.title,
				imageUrl: rawData.image_url,
				type: 'category',
				url: rawData.article_local_url,
			};
		} else {
			item = {
				label: rawData.title,
				imageUrl: rawData.thumbnail,
				type: rawData.type,
				url: rawData.url
			};

			// ArticlesApi doesn't return type for blog posts so we need to look at the namespace
			if (isEmpty(rawData.type) && rawData.ns === 500) {
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
