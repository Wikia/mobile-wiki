import Ember from 'ember';
import getEditToken from '../utils/edit-token';
import {form} from '../utils/content-type';

export default Ember.Service.extend({
	ajax: Ember.inject.service(),
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
			userUpvote = upvotes.findBy('from_user', this.get('currentUser.userId')) || {};

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
			userUpvote = upvote && (upvote.from_user === this.get('currentUser.userId')) ? upvote : {};

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
			if (Ember.isEmpty(revisionUpvotes.userUpvoteId) && Object.keys(userUpvote).length) {
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
		return getEditToken(title)
			.then((token) => {
				return this.get('ajax').post(M.buildUrl({
					path: '/wikia.php',
					query: {
						controller: 'RevisionUpvotesApiController',
						method: 'addUpvote'
					}
				}), {
					contentType: form,
					data: {
						revisionId,
						token
					}
				}).then((resp) => {
					if (resp && resp.success) {
						this.addRevisionUpvote(revisionId, {id: resp.id, from_user: this.get('currentUser.userId')});
					} else {
						throw new Error();
					}
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
		return getEditToken(title)
			.then((token) => {
				return this.get('ajax').post(M.buildUrl({
					path: '/wikia.php',
					query: {
						controller: 'RevisionUpvotesApiController',
						method: 'removeUpvote'
					}
				}), {
					contentType: form,
					data: {
						id: upvoteId,
						userId,
						token
					},
				}).then((resp) => {
					if (resp && resp.success) {
						this.removeRevisionUpvote(revisionId, upvoteId);
					} else {
						throw new Error();
					}
				});
			});
	}
});
