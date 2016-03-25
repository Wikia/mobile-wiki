import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	currRecentChangeId: null,

	actions: {
		/**
		 * Redirects back to Recent Wiki Activity list
		 * @returns {void}
		 */
		redirect() {
			return this.transitionToRoute('recent-wiki-activity', {queryParams: {rc: this.get('currRecentChangeId')}});
		},

		/**
		 * @param {string} revisionId Revision id that was upvoted
		 * @param {string} title Text title from main namespace that revision was upvoted
		 * @param {int} fromUser User id who upvoted
		 * @returns {Ember.RSVP.Promise}
		 */
		addUpvoteAction(revisionId, title, fromUser) {
			return this.get('model').upvote(revisionId, title, fromUser);
		},

		/**
		 * Removes upvote for given revision
		 *
		 * @param {int} upvoteId
		 * @returns {Ember.RSVP.Promise}
		 */
		removeUpvoteAction(upvoteId) {
			return this.get('model').removeUpvote(upvoteId);
		},

		/**
		 * Undo given revision
		 *
		 * @param {string} summary
		 * @returns {Ember.RSVP.Promise}
		 */
		undoRevision(summary) {
			this.get('application').set('isLoading', true);
			return this.get('model').undo(summary);
		},

		/**
		 * Adds error banner
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @returns {void}
		 */
		error(messageKey) {
			const application = this.get('application');

			application.addAlert({
				message: i18n.t(messageKey, {ns: 'recent-wiki-activity'}),
				type: 'alert'
			});

			application.set('isLoading', false);
		},

		/**
		 * Adds success banner
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @returns {void}
		 */
		success(messageKey) {
			this.get('application').addAlert({
				message: i18n.t(messageKey, {
					pageTitle: this.get('model.title'),
					ns: 'recent-wiki-activity'
				}),
				type: 'success'
			});
		},
	}
});
