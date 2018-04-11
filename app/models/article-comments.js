import EmberObject, {observer, get} from '@ember/object';
import {inject as service} from '@ember/service';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';
import getLanguageCodeFromRequest from '../utils/language';

export default EmberObject.extend({
	fastboot: service(),

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
		const langPath = getLanguageCodeFromRequest(this.get('fastboot.request'));

		return buildUrl({
			host: this.get('host'),
			langPath,
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
