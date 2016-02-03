import Ember from 'ember';
import UserModel from './user';

const ArticleDiffModel = Ember.Object.extend({
	oldid: null,
	newid: null,
	timestamp: null,
	title: null,
	pageid: null,
	user: null,
	namespace: null,
	diffs: null
});

ArticleDiffModel.reopenClass({
	fetch(oldid, newid) {
		return this.getDiffData(oldid, newid).then((data) => {
			return new Ember.RSVP.Promise((resolve, reject) => {
				let modelInstanse = null, page, revision, content, diffs = [], userId;

				page = data[Object.keys(data)[0]];
				revision = Ember.get(page, 'revisions').get('firstObject');

				userId = revision['userid'];

				UserModel.find({userId}).then((user) => {
					content = $(revision['diff']['*']);
					diffs = this.prepareDiff(content);

					modelInstanse = ArticleDiffModel.create({
						oldid: oldid,
						newid: newid,
						timestamp: revision['timestamp'],
						title: page['title'],
						pageid: page['pageid'],
						user: user,
						namespace: page['ns'],
						diffs: diffs
					});

					resolve(modelInstanse);
				}).catch((error) => {
					Ember.Logger.error(err);
					reject(error);
				});
			})
		})
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
				let pages;

				pages = Ember.get(response, 'query.pages');

				resolve(pages);
			}).fail((error) => {
				reject(error);
			});
		})
	},

	prepareDiff(content) {
		let diff = [], diffs = [], self = this,
			nodeDiffs, diffData, $oldDiff, $newDiff, oldDiffClass, newDiffClass;

		content.each(function(){
			if(this.nodeType === 1) {
				let node = $(this);
				node.find('.diff-marker').remove();
				nodeDiffs = node.children();
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

					newDiffClass = $newDiff.attr('class')
					diffData = self.getDiff($newDiff, newDiffClass);
					if (diffData) {
						diff.push(diffData);
					}
				}

				if ($oldDiff.hasClass('diff-lineno')) {
					if (diff.length) {
						diffs.push(diff);
					}
					diff = [];
					diff.push({
						content: Ember.String.htmlSafe($oldDiff.html()),
						type: oldDiffClass
					});
				}
			}
		});

		if (diff.length) {
			diffs.push(diff);
		}

		return diffs;
	},
	getDiff(diff, diffClass) {
		if (diffClass !== 'diff-empty' && diffClass === 'diff-deletedline' || diffClass === 'diff-addedline') {
			return {
				content: Ember.String.htmlSafe(diff.html()),
				type: diffClass
			};
		}

		return null;
	}
});

export default ArticleDiffModel;
