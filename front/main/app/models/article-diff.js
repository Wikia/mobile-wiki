import Ember from 'ember';
import getEditToken from '../utils/edit-token';
import request from 'ember-ajax/request';
import {form} from '../utils/content-type';

const ArticleDiffModel = Ember.Object.extend({
	anonymous: Ember.computed.equal('userId', 0),
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
	upvotes: null,
	upvotescount: 0,
	user: null,
	userId: null,
	useravatar: null,

	/**
	 * Sends request to MW API to undo newId revision of title
	 * @param {string|Array} [summary=[]] summary Description of reason for undo to be stored as edit summary
	 * CAUTION: if summary is {string} it will be used as a summary on MediaWiki side
	 *          if summary is empty {Array} MediaWiki will provide default summary
	 * @returns {Ember.RSVP.Promise}
	 */
	undo(summary = []) {
		if (!summary) {
			// See description of summary param
			summary = [];
		}
		return getEditToken(this.get('title'))
			.then((token) => {
				request(M.buildUrl({path: '/api.php'}), {
					method: 'POST',
					contentType: form,
					data: {
						action: 'edit',
						summary,
						title: this.get('title'),
						undo: this.get('newId'),
						undoafter: this.get('oldId'),
						token,
						format: 'json'
					},
				}).then((resp) => {
					if (resp && resp.edit && resp.edit.result === 'Success') {
						return resp.edit.result;
					} else if (resp && resp.error) {
						const errorMsg = resp.error.code === 'undofailure' ? 'main.undo-failure' : 'main.error';

						throw new Error(errorMsg);
					} else {
						throw new Error();
					}
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
		return request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'RevisionApi',
				method: 'getRevisionsDiff',
				avatar: true,
				upvotes: true,
				oldRev: true,
				newId,
				oldId
			}
		}).then(({article, revision, oldRevision, diffs = []}) => {
			const diffsData = ArticleDiffModel.prepareDiffs(diffs);

			let modelInstance = null,
				lengthChange = revision.size;

			if (!Ember.isNone(oldRevision)) {
				lengthChange = lengthChange - oldRevision.size;
			}

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
					upvotes: revision.upvotes || [],
					upvotescount: revision.upvotesCount,
					user: revision.userName,
					userId: revision.userId,
					useravatar: revision.userAvatar,
					lengthChange
				});
			}

			return modelInstance;
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
