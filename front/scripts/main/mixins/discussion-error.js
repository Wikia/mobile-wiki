import Ember from 'ember';

/**
 * Handles errors appears in the ajax calls.
 */
const DiscussionErrorMixin = Ember.Mixin.create({
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

		Ember.$('body').addClass(this.errorClass);
	}
});

export default DiscussionErrorMixin;
