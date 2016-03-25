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
		 * @param {int} revisionId Revision id that was upvoted
		 * @param {string} title Text title from main namespace that revision was upvoted
		 * @param {int} fromUser User id who upvoted
		 * @returns {Ember.RSVP.Promise}
		 */
		addRevisionUpvote(revisionId, title, fromUser) {
			return this.get('model').revisionUpvoteModel(revisionId, title, fromUser);
		}
	}
});
