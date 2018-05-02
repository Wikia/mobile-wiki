import EmberObject, {observer, get} from '@ember/object';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

export default EmberObject.extend({
	articleId: null,
	host: null,
	comments: 0,
	users: null,
	pagesCount: 0,
	page: 0,

	fetch: observer('page', 'articleId', function () {
		const page = this.get('page'),
			articleId = this.get('articleId');

		if (page && page >= 0 && articleId) {
			return fetch(this.url(articleId, page))
				.then((response) => response.json())
				.then((data) => {
					this.setProperties({
						comments: get(data, 'payload.comments'),
						users: get(data, 'payload.users'),
						pagesCount: get(data, 'pagesCount'),
						basePath: get(data, 'basePath')
					});

					return this;
				});
		}
	}),

	reset: observer('articleId', function () {
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
		return buildUrl({
			host: this.get('host'),
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
