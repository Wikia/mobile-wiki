/**
 * CuratedContentEditorRawSection
 * @typedef {Object} CuratedContentEditorRawSection
 * @property {String} label
 * @property {Number} image_id
 * @property {CuratedContentImageCropData} [image_crop]
 * @property {String} node_type
 * @property {CuratedContentEditorRawSection[]} items
 * @property {String} [image_url]
 * @property {String} [featured]
 * @property {String} [type]
 */

/**
 * CuratedContentValidationResponseError
 * @typedef {Object} CuratedContentValidationResponseError
 * @property {String} target
 * @property {String} type
 * @property {String} reason
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

App.CuratedContentEditorModel = Em.Object.extend({
	featured: null,
	curated: null,
	optional: null,
	isDirty: false
});

App.CuratedContentEditorModel.reopenClass({
	/**
	 * @param {CuratedContentEditorModel} model model to save
	 * @returns {Em.RSVP.Promise} returns returns promise
	 */
	save(model) {
		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php',
					query: {
						controller: 'CuratedContentController',
						method: 'setData'
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
	 * @returns {Em.RSVP.Promise} promise with data
	 */
	load() {
		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'CuratedContent',
					method: 'getData',
					format: 'json'
				},
				success: (data) => {
					if (Em.isArray(data.data)) {
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
	 * @param {CuratedContentEditorModel} model model to prepare
	 * @returns {Object} converted object
	 */
	prepareDataForSave(model) {
		return {
			data: [].concat(model.featured, model.curated.items, model.optional)
		};
	},

	/**
	 * Accepts a raw object that comes from CuratedContent API and creates a model that we can use
	 *
	 * @param {CuratedContentEditorRawSection[]} rawData data to sanitize
	 * @returns {CuratedContentEditorModel} sanitized model
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
	 * @param {CuratedContentEditorItemModel} parentItem parent item
	 * @param {String} itemLabel label of an item to get
	 * @returns {CuratedContentEditorItemModel} item
	 */
	getItem(parentItem, itemLabel) {
		let item = null;

		parentItem.items.some((itemObj) => {
			if (itemObj.label === itemLabel) {
				item = App.CuratedContentEditorItemModel.createNew(itemObj);
				return true;
			}
		});

		return item;
	},

	/**
	 * @param {CuratedContentEditorItemModel} modelRoot root to search in
	 * @param {String} excludedLabel=null label excluded from search
	 * @returns {String[]} already used labels
	 */
	getAlreadyUsedNonFeaturedItemsLabels(modelRoot, excludedLabel = null) {
		// Flatten the array
		return [].concat.apply([], modelRoot.curated.items.map((section) =>
			// Labels of section items
			this.getAlreadyUsedLabels(section, excludedLabel)
		).concat(
			// Labels of optional block items
			this.getAlreadyUsedLabels(modelRoot.optional, excludedLabel)
		));
	},

	/**
	 * @param {CuratedContentEditorItemModel} sectionOrBlock root to search in
	 * @param {String} excludedLabel=null label excluded from search
	 * @returns {String[]} already used labels
	 */
	getAlreadyUsedLabels(sectionOrBlock, excludedLabel = null) {
		let labels = [];

		if (Array.isArray(sectionOrBlock.items)) {
			labels = sectionOrBlock.items.map((item) => {
				const itemLabel = Em.get(item, 'label');

				return (excludedLabel === null || itemLabel !== excludedLabel) ? itemLabel : null;
			}).filter((item) => typeof item === 'string');
		}

		return labels;
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem parent item
	 * @param {CuratedContentEditorItemModel} newItem item to add
	 * @returns {void}
	 */
	addItem(parentItem, newItem) {
		// When parent doesn't have items we need to initialize them
		parentItem.items = parentItem.items || [];
		parentItem.items.push(newItem.toPlainObject());
		App.CuratedContentEditorModel.isDirty = true;
	},

	/**
	 * @param {CuratedContentEditorItemModel} parentItem parent item
	 * @param {CuratedContentEditorItemModel} newItem item to update
	 * @param {String} itemLabel item's original label
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
	 * @param {CuratedContentEditorItemModel} parentItem parent item
	 * @param {String} itemLabel label of an item to get
	 * @returns {void}
	 */
	deleteItem(parentItem, itemLabel) {
		parentItem.items = parentItem.items.filter((item) => item.label !== itemLabel);
		App.CuratedContentEditorModel.isDirty = true;
	}
});
