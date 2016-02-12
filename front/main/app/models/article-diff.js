import Ember from 'ember';
import getEditToken from '../utils/edit-token';

const ArticleDiffModel = Ember.Object.extend({
	diffs: null,
	namespace: null,
	newId: null,
	oldId: null,
	pageid: null,
	timestamp: null,
	title: null,
	user: null,
	useravatar: null,

	/**
	 * Sends request to MW API to undo newId revision of title
	 * @param {string} summary Description of reason for undo to be stored as edit summary
	 * @returns {Ember.RSVP.Promise}
	 */
	undo(summary = []) {
		// Fall back to empty array for falsy summary provided to make MW add default summary
		if (!summary) {
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
						user: revision.userName,
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
