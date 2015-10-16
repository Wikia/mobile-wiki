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
 * @property {String} image_url
 * @property {CuratedContentEditorItemModel[]} items
 * @property {String} label
 * @property {String} node_type
 * @property {String} title
 * @property {String} type
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

/**
 * CuratedContentGetImageResponse
 * @typedef {Object} CuratedContentGetImageResponse
 * @property {String} url
 * @property {id} image_id
 */

App.CuratedContentEditorItemModel.reopenClass({
	/**
	 * Object Model instance is only created once and all create() method invocations return already created object.
	 * Using extend prevents from sharing ember metadata between instances so each time fresh object instance is created.
	 *
	 * @param {Object} params params to extend
	 * @returns {CuratedContentEditorItemModel} model
	 */
	createNew(params = {}) {
		var modelParams = $.extend(true, {
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
	 * @param {String} title title of the article
	 * @param {Number} size desired size
	 * @returns {Em.RSVP.Promise} promise
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
				success: (response) => {
					resolve(response);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	},

	/**
	 * @param {CuratedContentEditorItemModel} item model to validate
	 * @param {Object} data data to extend
	 * @returns {Em.RSVP.Promise} promise
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
				success: (response) => {
					resolve(response);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	},

	/**
	 * @param {String} title title to get search suggestions
	 * @returns {Em.RSVP.Promise} promise
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
				success: (response) => {
					resolve(response);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}
});
