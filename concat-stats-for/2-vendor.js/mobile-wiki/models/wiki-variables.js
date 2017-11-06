define('mobile-wiki/models/wiki-variables', ['exports', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url', 'mobile-wiki/utils/errors'], function (exports, _mediawikiFetch, _url, _errors) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object;
	exports.default = EmberObject.extend({
		fetch: function fetch(host) {
			var url = (0, _url.buildUrl)({
				host: host,
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getWikiVariables',
					format: 'json'
				}
			});

			return (0, _mediawikiFetch.default)(url).then(function (response) {
				if (!response.ok) {
					return response.text().then(function (responseBody) {
						throw new _errors.WikiVariablesFetchError({
							code: response.status || 503
						}).withAdditionalData({
							host: host,
							responseBody: responseBody,
							url: url
						});
					});
				}

				var contentType = response.headers.get('content-type');

				if (contentType && contentType.indexOf('application/json') !== -1) {
					return response.json();
				} else if (url !== response.url) {
					// API was redirected to non-json page
					throw new _errors.WikiVariablesRedirectError().withAdditionalData({
						redirectLocation: response.url
					});
				} else {
					// non-json API response
					return response.text().then(function (responseBody) {
						throw new _errors.WikiVariablesFetchError({
							code: response.status || 503
						}).withAdditionalData({
							host: host,
							responseBody: responseBody,
							url: url
						});
					});
				}
			}).then(function (response) {
				if (!response.data.siteName) {
					response.data.siteName = 'Fandom powered by Wikia';
				}

				response.data.host = host;

				return response.data;
			}).catch(function (error) {
				if (error.name === 'WikiVariablesRedirectError') {
					throw error;
				}

				throw new _errors.WikiVariablesFetchError({
					code: error.code || 503
				}).withAdditionalData({
					host: host,
					url: url
				}).withPreviousError(error);
			});
		}
	});
});