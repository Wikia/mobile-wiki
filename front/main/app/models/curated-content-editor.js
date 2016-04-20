import Ember from 'ember';
import CuratedContentEditorItemModel from '../models/curated-content-editor-item';
import request from 'ember-ajax/request';

/**
 * CuratedContentEditorRawSection
 * @typedef {Object} CuratedContentEditorRawSection
 * @property {string} label
 * @property {Number} image_id
 * @property {CuratedContentImageCropData} [image_crop]
 * @property {string} node_type
 * @property {CuratedContentEditorRawSection[]} items
 * @property {string} [image_url]
 * @property {string} [featured]
 * @property {string} [type]
 */

/**
 * CuratedContentValidationResponseError
 * @typedef {Object} CuratedContentValidationResponseError
 * @property {string} target
 * @property {string} type
 * @property {string} reason
 */

/**
 * CuratedContentValidationResponse
 * @typedef {Object} CuratedContentValidationResponse
 * @property {Boolean} status
 * @property {CuratedContentValidationResponseError[]} [error]
 */

/**
 * CuratedContentEditorModel
 * @typedef {Object} CuratedContentEditorModel
 * @property {CuratedContentEditorItemModel[]} featured
 * @property {CuratedContentEditorItemModel[]} curated
 * @property {CuratedContentEditorItemModel[]} optional
 * @property {Boolean} isDirty
 */

const CuratedContentEditorModel = Ember.Object.extend({
	featured: null,
	curated: null,
	communityData: null,
	optional: null,
	isDirty: false
});

CuratedContentEditorModel.reopenClass({
	/**
	 * @param {CuratedContentEditorModel} model
	 * @returns {Ember.RSVP.Promise} server response after save
	 */
	save(model) {
		return request(M.buildUrl({
			path: '/wikia.php',
			query: {
				controller: 'CuratedContentController',
				method: 'setCuratedContentData'
			}
		}), {
			method: 'POST',
			data: this.prepareDataForSave(model),
		});
	},

	/**
	 * @returns {Ember.RSVP.Promise} model
	 */
	load() {
		return request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'CuratedContent',
				method: 'getData',
				format: 'json'
			},
		}).then((data) => {
			if (Ember.isArray(data.data)) {
				return CuratedContentEditorModel.sanitize(data.data);
			} else {
				throw new Error('Invalid data was returned from Curated Content API');
			}
		});
	},

	/**
	 * Convert CuratedContentEditorModel to structure known by CuratedContent API
	 *
	 * @param {CuratedContentEditorModel} model
	 * @returns {object} converted object
	 */
	prepareDataForSave(model) {
		return {
			data: [].concat(model.featured, model.curated.items, model.optional),
			community_data: model.communityData
		};
	},

	/**
	 * Accepts a raw object that comes from CuratedContent API and creates a model that we can use
	 *
	 * @param {CuratedContentEditorRawSection[]} rawData
	 * @returns {CuratedContentEditorModel} sanitized
	 */
	sanitize(rawData) {
		/**
		 * Label inside "optional" has to be initialized with empty string value.
		 * Code inside CuratedContentController:getSections (MW) decides based on this label
		 * if it's optional or not. If it's null it will fail rendering main page.
		 */
		const curated = {
			items: []
		};
		let featured = {
				items: [],
				featured: 'true'
			},
			optional = {
				items: [],
				label: ''
			},
			communityData = {
				community_data: 'true'
			};

		if (rawData.length) {
			rawData.forEach((section) => {
				if (section.featured === 'true') {
					featured = section;
				} else if (section.community_data === 'true') {
					communityData = section;
				} else if (section.label === '') {
					optional = section;
				} else {
					curated.items.push(section);
				}
			});
		}

		return CuratedContentEditorModel.create({
			featured,
			curated,
			optional,
			communityData
		});
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem
	 * @param {string} itemLabel
	 * @returns {CuratedContentEditorItemModel} item
	 */
	getItem(parentItem, itemLabel) {
		let item = null;

		parentItem.items.some((itemObj) => {
			if (itemObj.label === itemLabel) {
				item = CuratedContentEditorItemModel.createNew(itemObj);
				return true;
			}
		});

		return item;
	},

	/**
	 * @param {CuratedContentEditorItemModel} sectionOrBlock
	 * @param {string} excludedLabel=null
	 * @returns {string[]} already used labels
	 */
	getAlreadyUsedLabels(sectionOrBlock, excludedLabel = null) {
		let labels = [];

		if (Array.isArray(sectionOrBlock.items)) {
			labels = sectionOrBlock.items.map((item) => {
				const itemLabel = Ember.get(item, 'label');

				return (excludedLabel === null || itemLabel !== excludedLabel) ? itemLabel : null;
			}).filter((item) => typeof item === 'string');
		}

		return labels;
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem
	 * @param {CuratedContentEditorItemModel} newItem
	 * @returns {void}
	 */
	addItem(parentItem, newItem) {
		// When parent doesn't have items we need to initialize them
		parentItem.items = parentItem.items || [];
		parentItem.items.push(newItem.toPlainObject());
		CuratedContentEditorModel.isDirty = true;
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem
	 * @param {CuratedContentEditorItemModel} newItem
	 * @param {string} itemLabel - item's original label
	 * @returns {void}
	 */
	updateItem(parentItem, newItem, itemLabel) {
		if (parentItem.items) {
			parentItem.items.forEach((item, index, parentItems) => {
				if (item.label === itemLabel) {
					parentItems[index] = newItem.toPlainObject();
				}
			});
		}

		CuratedContentEditorModel.isDirty = true;
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem
	 * @param {string} itemLabel
	 * @returns {void}
	 */
	deleteItem(parentItem, itemLabel) {
		parentItem.items = parentItem.items.filter((item) => item.label !== itemLabel);
		CuratedContentEditorModel.isDirty = true;
	},

	/**
	 * @desc updates community data state
	 * @param {Ember.Object} model
	 * @param {Ember.Object} newState
	 * @returns {void}
	 */
	updateCommunityData(model, newState) {
		model.communityData = newState;
		CuratedContentEditorModel.isDirty = true;
	}
});

export default CuratedContentEditorModel;
