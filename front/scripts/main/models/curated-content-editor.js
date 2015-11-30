import App from '../app';
import CuratedContentEditorItemModel from '../models/curated-content-editor-item';

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

export default App.CuratedContentEditorModel = Ember.Object.extend({
	featured: null,
	curated: null,
	optional: null,
	isDirty: false
});

App.CuratedContentEditorModel.reopenClass({
	/**
	 * @param {CuratedContentEditorModel} model
	 * @returns {Ember.RSVP.Promise} server response after save
	 */
	save(model) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php',
					query: {
						controller: 'CuratedContentController',
						method: 'setCuratedContentData'
					}
				}),
				dataType: 'json',
				method: 'POST',
				data: this.prepareDataForSave(model),
				success: (data) => {
					resolve(data);
				},
				error: (data) => {
					reject(data);
				}
			});
		});
	},

	/**
	 * @returns {Ember.RSVP.Promise} model
	 */
	load() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'CuratedContent',
					method: 'getData',
					format: 'json'
				},
				success: (data) => {
					if (Ember.isArray(data.data)) {
						resolve(App.CuratedContentEditorModel.sanitize(data.data));
					} else {
						reject('Invalid data was returned from Curated Content API');
					}
				},
				error: (data) => {
					reject(data);
				}
			});
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
			data: [].concat(model.featured, model.curated.items, model.optional)
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
				featured: 'true',
			},
			optional = {
				items: [],
				label: ''
			};

		if (rawData.length) {
			rawData.forEach((section) => {
				if (section.featured === 'true') {
					featured = section;
				} else if (section.label === '') {
					optional = section;
				} else {
					curated.items.push(section);
				}
			});
		}

		return App.CuratedContentEditorModel.create({
			featured,
			curated,
			optional
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
		App.CuratedContentEditorModel.isDirty = true;
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem
	 * @param {CuratedContentEditorItemModel} newItem
	 * @param {string} itemLabel - item's original label
	 * @returns {void}
	 */
	updateItem(parentItem, newItem, itemLabel) {
		parentItem.items.forEach((item, index, parentItems) => {
			if (item.label === itemLabel) {
				parentItems[index] = newItem.toPlainObject();
			}
		});
		App.CuratedContentEditorModel.isDirty = true;
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem
	 * @param {string} itemLabel
	 * @returns {void}
	 */
	deleteItem(parentItem, itemLabel) {
		parentItem.items = parentItem.items.filter((item) => item.label !== itemLabel);
		App.CuratedContentEditorModel.isDirty = true;
	}
});
