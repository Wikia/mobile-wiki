/**
 * Handles errors appears in the ajax calls.
 */
App.DiscussionErrorMixin = Em.Mixin.create({
	errorCodes: {
		notFound: 404
	},

	errorClass: 'discussion-error-page',

	/**
	 * @param {*} err
	 * @param {*} model
	 * @returns {void}
	 */
	setErrorProperty(err, model) {
		if (err.status === this.errorCodes.notFound) {
			model.set('notFoundError', true);
		} else {
			model.set('connectionError', true);
		}

		Em.$('body').addClass(this.errorClass);
	}
});
