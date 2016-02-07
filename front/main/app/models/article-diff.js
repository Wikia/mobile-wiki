import Ember from 'ember';
import getEditToken from '../utils/edit-token';
import UserModel from './user';

const ArticleDiffModel = Ember.Object.extend({
	diffs: null,
	namespace: null,
	newid: null,
	oldid: null,
	pageid: null,
	timestamp: null,
	title: null,
	user: null,
	useravatar: null,

	/**
	 * Sends request to MW API to undo newid revision of title
	 * @returns {Ember.RSVP.Promise}
	 */
	undo() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(this.title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({path: '/api.php'}),
						data: {
							action: 'edit',
							title: this.title,
							undo: this.newid,
							undoafter: this.oldid,
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
	 * @param {number} oldid
	 * @param {number} newid
	 * @returns {Ember.RSVP.Promise}
     */
	fetch(oldid, newid) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.getJSON(
				M.buildUrl({
					path: '/wikia.php'
				}),
				{
					controller: 'RevisionApi',
					method: 'getRevisionsDiff',
					avatar: true,
					newId: newid,
					oldId: oldid
				}
			).done((response) => {
				const article = Ember.get(response, 'article'),
					revision = Ember.get(response, 'revision'),
					diffs = ArticleDiffModel.prepareDiffs(Ember.get(response, 'diffs'));

				let modelInstance = null;

				if (response) {
					modelInstance = ArticleDiffModel.create({
						diffs,
						namespace: article.ns,
						newid,
						oldid,
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
	 * Transforms diff data received from API to match required format
	 * @param {Array} content
	 * @returns {Array}
     */
	prepareDiffs(diffs) {
		diffs.forEach((diff) => {
			diff.classes = diff.classes.join(' ');
			diff.content = Ember.String.htmlSafe(diff.content);
		});

		return diffs;
	}
});

export default ArticleDiffModel;
