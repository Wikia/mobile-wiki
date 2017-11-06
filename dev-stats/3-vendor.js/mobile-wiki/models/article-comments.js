define('mobile-wiki/models/article-comments', ['exports', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object,
	    get = Ember.get,
	    observer = Ember.observer;
	exports.default = EmberObject.extend({
		articleId: null,
		host: null,
		comments: 0,
		users: null,
		pagesCount: 0,
		page: 0,

		fetch: observer('page', 'articleId', function () {
			var _this = this;

			var page = this.get('page'),
			    articleId = this.get('articleId');

			if (page && page >= 0 && articleId) {
				return (0, _mediawikiFetch.default)(this.url(articleId, page)).then(function (response) {
					return response.json();
				}).then(function (data) {
					_this.setProperties({
						comments: get(data, 'payload.comments'),
						users: get(data, 'payload.users'),
						pagesCount: get(data, 'pagesCount'),
						basePath: get(data, 'basePath')
					});

					return _this;
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
		url: function url(articleId) {
			var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			return (0, _url.buildUrl)({
				host: this.get('host'),
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getArticleComments',
					id: articleId,
					page: page
				}
			});
		}
	});
});