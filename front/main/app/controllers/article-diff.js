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
		 * Adds upvote for given revision
		 *
		 * @param {int} currentUserId
		 * @returns {Ember.RSVP.Promise}
		 */
		addRevisionUpvote(currentUserId) {
			return this.get('model').upvote(currentUserId);
		},

		/**
		 * Removes upvote for given revision
		 *
		 * @param {int} upvoteId
		 * @returns {Ember.RSVP.Promise}
		 */
		removeRevisionUpvote(upvoteId) {
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
