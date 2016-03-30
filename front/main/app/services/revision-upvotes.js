import Ember from 'ember';
import getEditToken from '../utils/edit-token';

export default Ember.Service.extend({
	upvotes: [],
	currentUser: Ember.inject.service(),

	/**
	 * Init upvotes
	 *
	 * @param {number} revisionId
	 * @param {array} upvotes
	 * @returns {void}
     */
	initUpvotes(revisionId, upvotes) {
		const revisionUpvotes = this.get('upvotes').findBy('revisionId', revisionId),
			userUpvote = upvotes.findBy('from_user', this.get('currentUser.userId')) || [];

		this.addVote(revisionId, revisionUpvotes, userUpvote, upvotes);
	},

	/**
	 * Add upvote to revision
	 *
	 * @param {number} revisionId
	 * @param {object} upvote
	 * @returns {void}
     */
	addRevisionUpvote(revisionId, upvote) {
		const revisionUpvotes = this.get('upvotes').findBy('revisionId', revisionId),
			userUpvote = revisionUpvotes ? upvote : upvote.findBy('from_user', this.get('currentUser.userId')) || [];

		this.addVote(revisionId, revisionUpvotes, userUpvote, upvote);
	},

	/**
	 * Remove upvote from revision
	 *
	 * @param {number} revisionId
	 * @param {number} upvoteId
	 * @returns {void}
     */
	removeRevisionUpvote(revisionId, upvoteId) {
		const revision = this.get('upvotes').findBy('revisionId', revisionId);

		if (revision) {
			if (revision.userUpvoteId === upvoteId) {
				Ember.set(revision, 'count', revision.count - 1);
				Ember.set(revision, 'userUpvoteId', null);
			}
		}
	},

	addVote(revisionId, revisionUpvotes, userUpvote, upvotes) {
		if (revisionUpvotes) {
			if (Ember.isEmpty(revisionUpvotes.userUpvoteId) && userUpvote) {
				Ember.set(revisionUpvotes, 'count', revisionUpvotes.count + 1);
				Ember.set(revisionUpvotes, 'userUpvoteId', userUpvote.id);
			}

		} else {
			this.get('upvotes').addObject({
				revisionId,
				count: upvotes.length,
				userUpvoteId: userUpvote.id
			});
		}
	},

	/**
	 * Sends request to MW API to upvote newId revision of title
	 * @param {number} revisionId ID of revision that is upvoted
	 * @param {string} title Text tilte of article in main namespace which revision is upvoted
	 * @returns {Ember.RSVP.Promise}
	 */
	upvote(revisionId, title) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({
							path: '/wikia.php',
							query: {controller: 'RevisionUpvotesApiController', method: 'addUpvote'}
						}),
						data: {
							revisionId,
							token
						},
						dataType: 'json',
						method: 'POST',
						success: (resp) => {
							if (resp && resp.success) {
								this.addRevisionUpvote(revisionId, {id: resp.id, from_user: this.get('currentUser.userId')});
								resolve();
							} else {
								reject();
							}
						},
						error: (err) => reject(err)
					});
				});
		});
	},

	/**
	 * Send request to server to remove previously added upvote for a revision
	 *
	 * @param {number} revisionId
	 * @param {number} upvoteId ID of upvote record to remove
	 * @param {string} title article title
	 * @param {number} userId user ID who made an edit
	 * @returns {Ember.RSVP.Promise}
	 */
	removeUpvote(revisionId, upvoteId, title, userId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({
							path: '/wikia.php',
							query: {controller: 'RevisionUpvotesApiController', method: 'removeUpvote'}
						}),
						data: {
							id: upvoteId,
							userId,
							token
						},
						dataType: 'json',
						method: 'POST',
						success: (resp) => {
							if (resp && resp.success) {
								this.removeRevisionUpvote(revisionId, upvoteId);
								resolve();
							} else {
								reject();
							}
						},
						error: (err) => reject(err)
					});
				});
		});
	}
});
