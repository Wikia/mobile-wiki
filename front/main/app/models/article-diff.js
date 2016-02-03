import Ember from 'ember';
import UserModel from './user';

const ArticleDiffModel = Ember.Object.extend({
	diffs: null,
	namespace: null,
	newid: null,
	oldid: null,
	pageid: null,
	timestamp: null,
	title: null,
	user: null
});

ArticleDiffModel.reopenClass({
	fetch(oldid, newid) {
		return this.getDiffData(oldid, newid).then((data) => {
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
						timestamp: new Date(revision.timestamp).getTime() / 1000,
						title: page.title,
						user
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
						type: oldDiffClass
					});
				} else {
					diffData = self.getDiff($oldDiff, oldDiffClass);
					if (diffData) {
						diff.push(diffData);
					}

					newDiffClass = $newDiff.attr('class');
					diffData = self.getDiff($newDiff, newDiffClass);
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
						type: oldDiffClass
					}];
				}
			}
		});

		if (diff.length) {
			diffs.push(diff);
		}

		return diffs;
	},

	getDiff(diff, diffClass) {
		if (diffClass === 'diff-deletedline' || diffClass === 'diff-addedline') {
			return {
				content: Ember.String.htmlSafe(diff.html()),
				type: diffClass
			};
		}

		return null;
	}
});

export default ArticleDiffModel;
