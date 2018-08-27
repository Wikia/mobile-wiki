import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import fetch from '../utils/mediawiki-fetch';
import {
	WikiVariablesRedirectError,
	WikiVariablesFetchError,
} from '../utils/errors';

export default EmberObject.extend({
	wikiUrls: service(),

	fetch(protocol, host, accessToken) {
		const url = this.wikiUrls.build({
			host,
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getWikiVariables',
				format: 'json',
			},
		});
		let options = {
			headers: {},
		};

		if (accessToken) {
			options.headers.Cookie = `access_token=${accessToken}`;
		}

		return fetch(url, options)
			.then((response) => {
				if (!response.ok) {
					return response.text().then(() => {
						throw new WikiVariablesFetchError({
							code: response.status || 503,
						}).withAdditionalData({
							host,
							url,
						});
					});
				}

				const contentType = response.headers.get('content-type');

				if (contentType && contentType.indexOf('application/json') !== -1) {
					return response.json();
				} else if (url !== response.url) {
					// API was redirected to non-json page
					throw new WikiVariablesRedirectError().withAdditionalData({
						redirectLocation: response.url,
					});
				} else {
					// non-json API response
					return response.text().then(() => {
						throw new WikiVariablesFetchError({
							code: response.status || 503,
						}).withAdditionalData({
							host,
							url,
						});
					});
				}

			}).then((response) => {
				if (!response.data.siteName) {
					response.data.siteName = 'Fandom powered by Wikia';
				}

				response.data.host = host;

				// Make sure basePath is using https if the current request from the client was made over https
				if ((accessToken || response.data.disableHTTPSDowngrade)
					&& response.data.basePath
					&& protocol === 'https'
				) {
					response.data.basePath = response.data.basePath.replace(/^http:\/\//, 'https://');
				}

				return response.data;
			})
			.catch((error) => {
				if (error.name === 'WikiVariablesRedirectError') {
					throw error;
				}

				throw new WikiVariablesFetchError({
					code: error.code || 503,
				}).withAdditionalData({
					host,
					url,
				}).withPreviousError(error);
			});
	},
});
