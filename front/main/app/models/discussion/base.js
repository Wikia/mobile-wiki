import Ember from 'ember';

export default Ember.Object.extend({
	wikiId: null,

	errorCodes: {
		notFound: 404
	},
	errorClass: 'discussion-error-page',
	pivotId: null,

	data: null,

	upvotingInProgress: {},

	/*
	 * Set minorError to true, when you don't want to display error message e.g.:
	 * 404 on infinite scroll, when unable to load non-existing pages
	 * 404 on "view older replies" button, when unable to load non-existing or deleted replies
	 */
	minorError: false,

	/**
	 * @returns {void}
	 */
	init() {
		const wikiId = Ember.get(Mercury, 'wiki.id');

		this.setProperties({
			data: Ember.Object.create({
				forumId: wikiId,
			}),
			wikiId
		});
	},

	/**
	 * @param {Object} err
	 *
	 * @returns {void}
	 */
	setErrorProperty(err) {
		if (err.status === this.errorCodes.notFound) {
			this.set('data.notFoundError', true);
		} else {
			this.set('data.connectionError', true);
		}
		Ember.$('body').addClass(this.errorClass);
	},

	/**
	 * @param {Object} err
	 *
	 * @returns {void}
	 */
	handleLoadMoreError(err) {
		if (err.status === this.errorCodes.notFound) {
			this.set('data.minorError', true);
		} else {
			this.setErrorProperty(err);
		}
	},

	/**
	 * @param {string} errorMessage
	 *
	 * @returns {void}
	 */
	setFailedState(errorMessage) {
		this.set('data.dialogMessage', errorMessage);
	},
});
