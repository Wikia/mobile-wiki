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
	undo(summary) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(this.title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({path: '/api.php'}),
						data: {
							action: 'edit',
							summary: summary,
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
		return ArticleDiffModel.getDiffData(oldid, newid).then((data) => {
			return new Ember.RSVP.Promise((resolve, reject) => {
				const page = data[Object.keys(data)[0]],
					revision = Ember.get(page, 'revisions.firstObject'),
					userId = revision.userid;

				UserModel.find({userId}).then((user) => {
					const content = $(revision.diff['*']),
						diffs = this.prepareDiff(content);

					resolve(ArticleDiffModel.create({
						diffs,
						namespace: page.ns,
						newid,
						oldid,
						pageid: page.pageid,
						parsedcomment: revision.parsedcomment,
						timestamp: revision.timestamp,
						title: page.title,
						user: user.name,
						useravatar: user.avatarPath
					}));
				}).catch((error) => {
					Ember.Logger.error(error);
					reject(error);
				});
			});
		});
	},

	/**
	 * Fetches diff data from MW API
	 * @param {number} oldid
	 * @param {number} newid
	 * @returns {Ember.RSVP.Promise}
     */
	getDiffData(oldid, newid) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.getJSON(
				M.buildUrl({
					path: '/api.php'
				}),
				{
					format: 'json',
					action: 'query',
					prop: 'revisions',
					rvprop: 'timestamp|parsedcomment|userid',
					revids: oldid,
					rvdiffto: newid
				}
			).done((response) => {
				const pages = Ember.get(response, 'query.pages');

				resolve(pages);
			}).fail(reject);
		});
	},

	/**
	 * Transforms diff data received from API to match required format
	 * @param {Array} content
	 * @returns {Array}
     */
	prepareDiff(content) {
		const diffs = [], self = this;
		let diff = [];

		content.each(function () {
			if (this.nodeType === this.ELEMENT_NODE) {
				const $node = $(this);
				let	$nodeDiffs, diffData, $oldDiff, $newDiff, oldDiffClass, newDiffClass;

				$node.find('.diff-marker').remove();
				$nodeDiffs = $node.children();
				$oldDiff = $nodeDiffs.eq(0);
				$newDiff = $nodeDiffs.eq(1);

				oldDiffClass = $oldDiff.attr('class');

				if (oldDiffClass === 'diff-context') {
					diff.push({
						content: Ember.String.htmlSafe($oldDiff.html()),
						class: oldDiffClass
					});
				} else {
					newDiffClass = $newDiff.attr('class');

					diffData = self.getDiff($oldDiff, oldDiffClass, $newDiff.hasClass('diff-empty'), 'previous');
					if (diffData) {
						diff.push(diffData);
					}

					diffData = self.getDiff($newDiff, newDiffClass, $oldDiff.hasClass('diff-empty'), 'current');
					if (diffData) {
						diff.push(diffData);
					}
				}

				if ($oldDiff.hasClass('diff-lineno')) {
					if (diff.length) {
						diffs.push(diff);
					}
					diff = [{
						content: Ember.String.htmlSafe($oldDiff.html()),
						class: oldDiffClass,
						isLine: true
					}];
				}
			}
		});

		if (diff.length) {
			diffs.push(diff);
		}

		return diffs;
	},

	/**
	 * Prepares proper diff object for line
	 * @param {Array} diff
	 * @param {string} diffClass
	 * @param {boolean} allChanged
	 * @param {string} type
     * @returns {{content: string, class: string, allChanged: boolean}|null}
     */
	getDiff(diff, diffClass, allChanged) {
		if (diffClass === 'diff-deletedline' || diffClass === 'diff-addedline') {
			return {
				content: Ember.String.htmlSafe(diff.html()),
				class: diffClass,
				allChanged
			};
		}

		return null;
	}
});

export default ArticleDiffModel;
