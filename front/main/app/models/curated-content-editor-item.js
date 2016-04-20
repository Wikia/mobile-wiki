import Ember from 'ember';
import ObjectUtilitiesMixin from '../mixins/object-utilities';
import request from 'ember-ajax/request';

/**
 * CuratedContentImageCropSingleData
 * @typedef {Object} CuratedContentImageCropSingleData
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 */

/**
 * CuratedContentImageCropData
 * @typedef {Object} CuratedContentImageCropData
 * @property {CuratedContentImageCropSingleData} [landscape]
 * @property {CuratedContentImageCropSingleData} [square]
 */

/**
 * CuratedContentEditorItemModel
 * @typedef {Object} CuratedContentEditorItemModel
 * @property {Number} article_id
 * @property {Number} image_id
 * @property {CuratedContentImageCropData} image_crop
 * @property {string} image_url
 * @property {CuratedContentEditorItemModel[]} items
 * @property {string} label
 * @property {string} node_type
 * @property {string} title
 * @property {string} type
 */

/**
 * CuratedContentGetImageResponse
 * @typedef {Object} CuratedContentGetImageResponse
 * @property {string} url
 * @property {id} image_id
 */

const CuratedContentEditorItemModel = Ember.Object.extend(
	ObjectUtilitiesMixin,
	{
		article_id: null,
		image_id: null,
		image_crop: null,
		image_url: null,
		items: null,
		label: null,
		node_type: null,
		title: null,
		type: null
	}
);

CuratedContentEditorItemModel.reopenClass({
	/**
	 * Object Model instance is only created once and all create() method invocations return already created object.
	 * Using extend prevents from sharing ember metadata between instances so each time fresh object instance is created.
	 *
	 * @param {Object} [params={}]
	 * @returns {CuratedContentEditorItemModel} model
	 */
	createNew(params = {}) {
		const modelParams = $.extend(true, {
			article_id: null,
			image_id: null,
			image_crop: null,
			image_url: null,
			items: null,
			label: null,
			node_type: null,
			title: null,
			type: null
		}, params);

		return CuratedContentEditorItemModel.create(modelParams);
	},

	/**
	 * @param {string} title
	 * @param {number} size
	 * @returns {Ember.RSVP.Promise} image data
	 */
	getImage(title, size) {
		return request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'CuratedContent',
				method: 'getImage',
				title,
				size
			},
		});
	},

	/**
	 * @param {CuratedContentEditorItemModel} item
	 * @param {string} methodName
	 * @returns {Em.RSVP.Promise} server response
	 */
	validateServerData(item, methodName) {
		const completeData = {
			controller: 'CuratedContentValidator',
			method: methodName,
			item: item.toPlainObject(),
			format: 'json'
		};

		return request(M.buildUrl({path: '/wikia.php'}), {
			method: 'POST',
			data: completeData,
		});
	},

	/**
	 * @param {string} title
	 * @param {boolean} isCategory
	 * @returns {Ember.RSVP.Promise} search suggestions
	 */
	getSearchSuggestions(title, isCategory) {
		const data = {
			controller: 'MercuryApi',
			method: 'getSearchSuggestions',
			query: title
		};

		if (!title) {
			return Ember.RSVP.reject();
		}

		if (isCategory === true) {
			data.ns = 14;
		}

		return request(M.buildUrl({path: '/wikia.php'}), {
			data,
		});
	}
});

export default CuratedContentEditorItemModel;
