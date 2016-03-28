import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),
	queryParams: ['rc'],
	rc: null,

	actions: {

		/**
		 * Adds upvote for given revision from provided user
		 *
		 * @param {string} revisionId Revision id that was upvoted
		 * @param {string} title Text title from main namespace that revision was upvoted
		 * @param {int} fromUser User id who upvoted
		 * @returns {Ember.RSVP.Promise}
		 */
		addRevisionUpvote(revisionId, title, fromUser) {
			return this.get('model').revisionUpvoteModel(revisionId, title, fromUser);
		},

		/**
		 * Adds error banner
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @returns {void}
		 */
		showError(messageKey) {
			const application = this.get('application');

			application.addAlert({
				message: i18n.t(messageKey, {ns: 'recent-wiki-activity'}),
				type: 'alert'
			});
		},
	}
});
