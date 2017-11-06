define('mobile-wiki/models/navigation', ['exports', 'mobile-wiki/utils/errors', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _errors, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object;
	exports.default = EmberObject.extend({
		fetchAll: function fetchAll(host, wikiId, language) {
			var url = (0, _url.buildUrl)({
				host: host,
				path: '/api/v1/design-system/wikis/' + wikiId + '/' + language + '/',
				wiki: 'www'
			});

			return (0, _mediawikiFetch.default)(url).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					return (0, _errors.getFetchErrorMessage)(response).then(function (responseBody) {
						throw new _errors.DesignSystemFetchError({
							code: 503
						}).withAdditionalData({
							responseStatus: response.status,
							responseBody: responseBody,
							requestUrl: url,
							responseUrl: response.url
						});
					});
				}
			}).then(function (navigationData) {
				return {
					globalFooter: navigationData['global-footer'],
					globalNavigation: navigationData['global-navigation']
				};
			});
		}
	});
});