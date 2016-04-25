import Ember from 'ember';
import getEditToken from '../utils/edit-token';
import request from 'ember-ajax/request';
import {form} from '../utils/content-type';

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
						contentType: form,
						data: {
							action: 'edit',
							title: model.title,
							section: model.sectionIndex,
							text: model.content,
							token,
							format: 'json'
						},
					}).then((response) => {
						if (response && response.edit && response.edit.result === 'Success') {
							return response.edit.result;
						} else if (response && response.error) {
							throw new Error(response.error.code);
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
			}).then((response) => {
				let pages,
					revision;

				if (response.error) {
					throw new Error(response.error.code);
				}

				pages = Ember.get(response, 'query.pages');

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
