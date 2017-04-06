import Ember from 'ember';
import getEditToken from '../utils/edit-token';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

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
		 * @param {string} host
		 * @param {*} model
		 * @returns {Ember.RSVP.Promise}
		 */
		publish(host, model) {
			return getEditToken(host, model.title)
				.then((token) => {
					const formData = new FormData();

					formData.append('action', 'edit');
					formData.append('title', model.title);
					formData.append('section', model.sectionIndex);
					formData.append('text', model.content);
					formData.append('token', token);
					formData.append('format', 'json');

					return fetch(buildUrl({host, path: '/api.php'}), {
						method: 'POST',
						body: formData,
					})
						.then((response) => response.json())
						.then((response) => {
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
		 * @param {string} host
		 * @param {string} title
		 * @param {number} sectionIndex
		 * @returns {Ember.RSVP.Promise}
		 */
		load(host, title, sectionIndex) {
			return fetch(buildUrl({
				host,
				path: '/api.php',
				query: {
					action: 'query',
					prop: 'revisions',
					// FIXME: It should be possible to pass props as an array
					rvprop: 'content|timestamp',
					titles: title,
					rvsection: sectionIndex,
					format: 'json',
					cb: new Date().getTime()
				}
			}), {
				cache: 'no-store'
			}).then((response) => response.json())
				.then((response) => {
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
