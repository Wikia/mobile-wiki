import EmberObject from '@ember/object';

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

export default EmberObject.extend({
	title: null,
	type: null,
	items: []
});
