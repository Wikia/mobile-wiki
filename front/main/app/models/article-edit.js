import Ember from 'ember';
import ArticleEditMixin from '../mixins/article-edit';

const ArticleEditModel = Ember.Object.extend({
	content: null,
	originalContent: null,
	timestamp: null,
	title: null,
	sectionIndex: null,
	isDirty: Ember.computed('content', 'originalContent', function () {
		return this.get('content') !== this.get('originalContent');
	})
});

ArticleEditModel.reopenClass(
	ArticleEditMixin,
	{
		/**
		 * @param {*} model
		 * @returns {Ember.RSVP.Promise}
		 */
		publish(model) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				this.getEditToken(model.title)
					.then((token) => {
						Ember.$.ajax({
							url: M.buildUrl({path: '/api.php'}),
							data: {
								action: 'edit',
								title: model.title,
								section: model.sectionIndex,
								text: model.content,
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
		},

		/**
		 * @param {string} title
		 * @param {number} sectionIndex
		 * @returns {Ember.RSVP.Promise}
		 */
		load(title, sectionIndex) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				Ember.$.ajax({
					url: M.buildUrl({path: '/api.php'}),
					dataType: 'json',
					cache: false,
					data: {
						action: 'query',
						prop: 'revisions',
						// FIXME: It should be possible to pass props as an array
						rvprop: 'content|timestamp',
						titles: title,
						rvsection: sectionIndex,
						format: 'json'
					}
				}).done((resp) => {
					let pages,
						revision;

					if (resp.error) {
						reject(resp.error.code);
						return;
					}

					pages = Ember.get(resp, 'query.pages');

					if (pages) {
						// FIXME: MediaWiki API, seriously?
						revision = pages[Object.keys(pages)[0]].revisions[0];
						resolve(ArticleEditModel.create({
							title,
							sectionIndex,
							content: revision['*'],
							originalContent: revision['*'],
							timestamp: revision.timestamp
						}));
					} else {
						reject();
					}
				}).fail((err) => reject(err));
			});
		}
	}
);

export default ArticleEditModel;
