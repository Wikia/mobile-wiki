App.ImageReviewItemModel = Em.Object.extend(App.ObjectUtilitiesMixin, {
	imageId: null,
	contractId: null
});

App.ImageReviewItemModel.reopenClass({
	/**
	 * Object Model instance is only created once and all create() method invocations return already created object.
	 * Using extend prevents from sharing ember metadata between instances so each time fresh object instance is created.
	 *
	 * @param {Object} params
	 * @returns {ImageReviewItemModel} model
	 */
	createNew(params = {}) {
		const modelParams = $.extend(true, {
			imageId: null,
			contractId: null,
		}, params);

		return App.ImageReviewItemModel.create(modelParams);
	}
});
