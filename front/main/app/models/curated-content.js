import Ember from 'ember';

const {Object: EmberObject} = Ember;

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

export default CuratedContentModel;
