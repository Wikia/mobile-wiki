import Ember from 'ember';
import getEditToken from '../utils/edit-token';
import request from 'ember-ajax/request';

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
	{
		/**
		 * @param {*} model
		 * @returns {Ember.RSVP.Promise}
		 */
		publish(model) {
			return getEditToken(model.title)
					.then((token) => {
						return request(M.buildUrl({path: '/api.php'}), {
							method: 'POST',
							data: {
								action: 'edit',
								title: model.title,
								section: model.sectionIndex,
								text: model.content,
								token,
								format: 'json'
							},
						}).then((resp) => {
							if (resp && resp.edit && resp.edit.result === 'Success') {
								return resp.edit.result;
							} else if (resp && resp.error) {
								throw new Error(resp.error.code);
							} else {
								throw new Error();
							}
						});
					});
		},

		/**
		 * @param {string} title
		 * @param {number} sectionIndex
		 * @returns {Ember.RSVP.Promise}
		 */
		load(title, sectionIndex) {
			return request(M.buildUrl({path: '/api.php'}), {
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
				}).then((resp) => {
					let pages,
						revision;

					if (resp.error) {
						throw new Error(resp.error.code);
					}

					pages = Ember.get(resp, 'query.pages');

					if (pages) {
						// FIXME: MediaWiki API, seriously?
						revision = pages[Object.keys(pages)[0]].revisions[0];
						return ArticleEditModel.create({
							title,
							sectionIndex,
							content: revision['*'],
							originalContent: revision['*'],
							timestamp: revision.timestamp
						});
					} else {
						throw new Error();
					}
				});
		}
	}
);

export default ArticleEditModel;
