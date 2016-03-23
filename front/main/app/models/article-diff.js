import Ember from 'ember';
import getEditToken from '../utils/edit-token';

const ArticleDiffModel = Ember.Object.extend({
	diffs: null,
	id: Ember.computed('newId', 'oldId', function () {
		return `${this.get('newId')}-${this.get('oldId')}`;
	}),
	namespace: null,
	newId: null,
	oldId: null,
	pageid: null,
	timestamp: null,
	title: null,
	user: null,
	userId: null,
	useravatar: null,

	/**
	 * Sends request to MW API to undo newId revision of title
	 * @param {*} summary Description of reason for undo to be stored as edit summary
	 * CAUTION: if summary is {string} it will be used as a summary on MediaWiki side
	 *          if summary is empty {Array} MediaWiki will provide default summary
	 * @returns {Ember.RSVP.Promise}
	 */
	undo(summary = []) {
		if (!summary) {
			// See description of summary param
			summary = [];
		}
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(this.title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({path: '/api.php'}),
						data: {
							action: 'edit',
							summary,
							title: this.title,
							undo: this.newId,
							undoafter: this.oldId,
							token,
							format: 'json'
						},
						dataType: 'json',
						method: 'POST',
						success: (resp) => {
							if (resp && resp.edit && resp.edit.result === 'Success') {
								resolve();
							} else if (resp && resp.error) {
								reject(resp.error.code);
							} else {
								reject();
							}
						},
						error: reject
					});
				}, (err) => reject(err));
		});
	},

	/**
	 * Sends request to MW API to upvote newId revision of title
	 * @returns {Ember.RSVP.Promise}
	 */
	upvote() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(this.title)
			.then((token) => {
				Ember.$.ajax({
					url: M.buildUrl({
						path: '/wikia.php',
						query: {controller: 'RevisionUpvotesApiController', method: 'addUpvote'}
					}),
					data: {
						revisionId: this.newId,
						token
					},
					dataType: 'json',
					method: 'POST',
					success: (resp) => {
						if (resp && resp.success) {
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
	 * @param {int} upvoteId ID of upvote record to remove
	 * @param {int} userId user ID who made an edit
	 * @returns {Ember.RSVP.Promise}
	 */
	removeUpvote(upvoteId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(this.title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({
							path: '/wikia.php',
							query: {controller: 'RevisionUpvotesApiController', method: 'removeUpvote'}
						}),
						data: {
							id: upvoteId,
							userId: this.userId,
							token
						},
						dataType: 'json',
						method: 'POST',
						success: (resp) => {
							if (resp && resp.success) {
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

ArticleDiffModel.reopenClass({
	/**
	 * Uses the data received from API to fill needed information
	 * @param {number} oldId
	 * @param {number} newId
	 * @returns {Ember.RSVP.Promise}
	 */
	fetch(oldId, newId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.getJSON(
				M.buildUrl({
					path: '/wikia.php'
				}),
				{
					controller: 'RevisionApi',
					method: 'getRevisionsDiff',
					avatar: true,
					upvotes: true,
					newId,
					oldId
				}
			).done(({article, revision, diffs = []}) => {
				const diffsData = ArticleDiffModel.prepareDiffs(diffs);

				let modelInstance = null;

				if (diffs) {
					modelInstance = ArticleDiffModel.create({
						diffs: diffsData,
						namespace: article.ns,
						newId,
						oldId,
						pageid: article.pageId,
						parsedcomment: revision.parsedComment,
						timestamp: revision.timestamp,
						title: article.title,
						upvotes: revision.upvotes,
						upvotescount: revision.upvotesCount,
						user: revision.userName,
						userId: revision.userId,
						useravatar: revision.userAvatar
					});
				}

				resolve(modelInstance);
			}).fail(reject);
		});
	},

	/**
	 * Prepares diffs data received from API
	 * @param {Array} diffs
	 * @returns {Array}
	 */
	prepareDiffs(diffs) {
		return diffs.map((diff) => {
			diff.classes = diff.classes.join(' ');
			diff.content = Ember.String.htmlSafe(diff.content);
			return diff;
		});
	}
});

export default ArticleDiffModel;
