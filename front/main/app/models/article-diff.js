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
	useravatar: null
});

ArticleDiffModel.reopenClass({
	fetch(oldid, newid) {
		return ArticleDiffModel.getDiffData(oldid, newid).then((data) => {
			return new Ember.RSVP.Promise((resolve, reject) => {
				const page = data[Object.keys(data)[0]],
					revision = Ember.get(page, 'revisions').get('firstObject'),
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
					rvprop: 'timestamp|userid',
					revids: oldid,
					rvdiffto: newid
				}
			).done((response) => {
				const pages = Ember.get(response, 'query.pages');

				resolve(pages);
			}).fail((error) => {
				reject(error);
			});
		});
	},

	prepareDiff(content) {
		const diffs = [], self = this;
		let diff = [];

		content.each(function () {
			if (this.nodeType === 1) {
				const $node = $(this);
				let	nodeDiffs, diffData, $oldDiff, $newDiff, oldDiffClass, newDiffClass;

				$node.find('.diff-marker').remove();
				nodeDiffs = $node.children();
				$oldDiff = $(nodeDiffs.get(0));
				$newDiff = $(nodeDiffs.get(1));

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

	getDiff(diff, diffClass, allChanged, type) {
		if (diffClass === 'diff-deletedline' || diffClass === 'diff-addedline') {
			const diffData = {
				content: Ember.String.htmlSafe(diff.html()),
				class: diffClass,
				allChanged
			};

			if (type === 'previous') {
				diffData.isPrevious = true;
			} else if (type === 'current') {
				diffData.isCurrent = true;
			}

			return diffData;
		}

		return null;
	},

	undo(model) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(model.title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({path: '/api.php'}),
						data: {
							action: 'edit',
							title: model.title,
							undo: model.newid,
							undoafter: model.oldid,
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
						error: (err) => reject(err)
					});
				}, (err) => reject(err));
		});
	}
});

export default ArticleDiffModel;
