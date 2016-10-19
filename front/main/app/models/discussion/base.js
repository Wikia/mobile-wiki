import Ember from 'ember';

export default Ember.Object.extend({
	error: null,
	errorCodes: {
		notFound: '404'
	},
	errorClass: 'discussion-error-page',
	data: null,
	followingInProgress: {},
	/*
	 * Set minorError to true, when you don't want to display error message e.g.:
	 * 404 on infinite scroll, when unable to load non-existing pages
	 * 404 on "view older replies" button, when unable to load non-existing or deleted replies
	 */
	minorError: false,
	pivotId: null,
	upvotingInProgress: {},
	wikiId: null,

	// number of pages to load when load-more action is called
	loadMoreLimit: 20,
	// number of pages to load on the new page
	postsLimit: 20,

	/**
	 * @returns {void}
	 */
	init() {
		const wikiId = Ember.get(Mercury, 'wiki.id');

		this.setProperties({
			data: Ember.Object.create(),
			error: Ember.Object.create(),
			wikiId
		});
	},

	/**
	 * @param {Object} err
	 *
	 * @returns {void}
	 */
	setErrorProperty(err) {
		if (err.errors[0].status === this.errorCodes.notFound) {
			this.set('error.isNotFound', true);
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
