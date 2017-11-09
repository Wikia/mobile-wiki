import EmberObject from '@ember/object';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';
import {WikiVariablesRedirectError, WikiVariablesFetchError} from '../utils/errors';

export default EmberObject.extend({
	fetch(host) {
		const url = buildUrl({
			host,
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getWikiVariables',
				format: 'json'
			}
		});

		return fetch(url)
			.then((response) => {
				if (!response.ok) {
					return response.text().then((responseBody) => {
						throw new WikiVariablesFetchError({
							code: response.status || 503
						}).withAdditionalData({
							host,
							responseBody,
							url
						});
					});
				}

				const contentType = response.headers.get('content-type');

				if (contentType && contentType.indexOf('application/json') !== -1) {
					return response.json();
				} else if (url !== response.url) {
					// API was redirected to non-json page
					throw new WikiVariablesRedirectError().withAdditionalData({
						redirectLocation: response.url
					});
				} else {
					// non-json API response
					return response.text().then((responseBody) => {
						throw new WikiVariablesFetchError({
							code: response.status || 503
						}).withAdditionalData({
							host,
							responseBody,
							url
						});
					});
				}

			}).then((response) => {
				if (!response.data.siteName) {
					response.data.siteName = 'Fandom powered by Wikia';
				}

				response.data.host = host;

				return response.data;
			})
			.catch((error) => {
				if (error.name === 'WikiVariablesRedirectError') {
					throw error;
				}

				throw new WikiVariablesFetchError({
					code: error.code || 503
				}).withAdditionalData({
					host,
					url
				}).withPreviousError(error);
			});
	}
});
