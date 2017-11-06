define('mobile-wiki/models/tracking-dimensions', ['exports', 'mobile-wiki/utils/errors', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _errors, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var EmberObject = Ember.Object;
	exports.default = EmberObject.extend({
		fastboot: service(),
		logger: service(),

		fetch: function fetch(isAnon, host, title) {
			var _this = this;

			var url = (0, _url.buildUrl)({
				host: host,
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getTrackingDimensions',
					title: title,
					isanon: isAnon,
					format: 'json'
				}
			});

			return (0, _mediawikiFetch.default)(url).then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					return (0, _errors.getFetchErrorMessage)(response).then(function (responseBody) {
						throw new _errors.TrackingDimensionsFetchError({
							code: response.status
						}).withAdditionalData({
							responseBody: responseBody,
							requestUrl: url,
							responseUrl: response.url
						});
					});
				}
			}).catch(function (error) {
				return _this.get('logger').error('getTrackingDimensions error: ', error);
			});
		}
	});
});