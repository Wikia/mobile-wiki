/**
 * CuratedContentImageCropSingleData
 * @typedef {object} CuratedContentImageCropSingleData
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 */

/**
 * CuratedContentImageCropData
 * @typedef {object} CuratedContentImageCropData
 * @property {CuratedContentImageCropSingleData} [landscape]
 * @property {CuratedContentImageCropSingleData} [square]
 */

/**
 * CuratedContentEditorItemModel
 * @typedef {object} CuratedContentEditorItemModel
 * @property {Number} article_id
 * @property {Number} image_id
 * @property {CuratedContentImageCropData} image_crop
 * @property {String} image_url
 * @property {CuratedContentEditorItemModel[]} items
 * @property {String} label
 * @property {String} node_type
 * @property {String} title
 * @property {String} type
 */

/**
 * CuratedContentGetImageResponse
 * @typedef {object} CuratedContentGetImageResponse
 * @property {String} url
 * @property {id} image_id
 */

App.CuratedContentEditorItemModel = Em.Object.extend(App.ObjectUtilitiesMixin, {
	article_id: null,
	image_id: null,
	image_crop: null,
	image_url: null,
	items: null,
	label: null,
	node_type: null,
	title: null,
	type: null
});

App.CuratedContentEditorItemModel.reopenClass({
	/**
	 * Object Model instance is only created once and all create() method invocations return already created object.
	 * Using extend prevents from sharing ember metadata between instances so each time fresh object instance is created.
	 *
	 * @param {object} params
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

		return App.CuratedContentEditorItemModel.create(modelParams);
	},

	/**
	 * @param {string} title
	 * @param {number} size
	 * @returns {Em.RSVP.Promise} image data
	 */
	getImage(title, size) {
		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php',
				}),
				data: {
					controller: 'CuratedContent',
					method: 'getImage',
					title,
					size
				},
				dataType: 'json',
				success: (response) => resolve(response),
				error: (error) => reject(error)
			});
		});
	},

	/**
	 * @param {CuratedContentEditorItemModel} item
	 * @param {object} data
	 * @returns {Em.RSVP.Promise} server response
	 */
	validateServerData(item, data) {
		const completeData = $.extend({}, data, {
			controller: 'CuratedContentValidator',
			item: item.toPlainObject(),
			format: 'json'
		});

		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: completeData,
				method: 'POST',
				dataType: 'json',
				success: (response) => resolve(response),
				error: (error) => reject(error)
			});
		});
	},

	/**
	 * @param {string} title
	 * @returns {Em.RSVP.Promise} search suggestions
	 */
	getSearchSuggestions(title) {
		return new Em.RSVP.Promise((resolve, reject) => {
			if (!title) {
				return reject();
			}

			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'MercuryApi',
					method: 'getSearchSuggestions',
					query: title
				},
				dataType: 'json',
				success: (response) => resolve(response),
				error: (error) => reject(error)
			});
		});
	}
});
