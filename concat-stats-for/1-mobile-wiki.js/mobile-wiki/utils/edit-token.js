define('mobile-wiki/utils/edit-token', ['exports', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (host, title) {
		return (0, _mediawikiFetch.default)((0, _url.buildUrl)({
			host: host,
			path: '/api.php',
			query: {
				action: 'query',
				prop: 'info',
				titles: title,
				intoken: 'edit',
				format: 'json'
			}
		})).then(function (response) {
			return response.json();
		}).then(function (resp) {
			var pages = get(resp, 'query.pages');

			if (pages) {
				// FIXME: MediaWiki API, seriously?
				var edittoken = pages[Object.keys(pages)[0]].edittoken;

				if (typeof edittoken === 'undefined') {
					throw new Error('noedit');
				}

				return edittoken;
			} else {
				throw new Error();
			}
		});
	};

	var get = Ember.get;
});