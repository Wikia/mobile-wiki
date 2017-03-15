import Ember from 'ember';
import request from 'ember-ajax/request';

export default Ember.Object.extend({
	articleId: null,
	comments: 0,
	users: null,
	pagesCount: 0,
	page: 0,

	fetch: Ember.observer('page', 'articleId', function () {
		const page = this.get('page'),
			articleId = this.get('articleId');

		if (page && page >= 0 && articleId) {
			return request(this.url(articleId, page))
				.then((data) => {
					this.setProperties({
						comments: Ember.get(data, 'payload.comments'),
						users: Ember.get(data, 'payload.users'),
						pagesCount: Ember.get(data, 'pagesCount'),
						basePath: Ember.get(data, 'basePath')
					});

					return this;
				});
		}
	}),

	reset: Ember.observer('articleId', function () {
		this.setProperties({
			comments: 0,
			users: null,
			pagesCount: 0
		});
	}),

	/**
	 * @param {number} articleId
	 * @param {number} [page=0]
	 * @returns {string}
	 */
	url(articleId, page = 0) {
		return M.buildUrl({
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getArticleComments',
				id: articleId,
				page
			}
		});
	}
});
