import Ember from 'ember';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';
import {NonJsonApiResponseError, WikiVariablesFetchError, DesignSystemFetchError} from '../errors/main';

const WikiVariablesModel = Ember.Object.extend({});

WikiVariablesModel.reopenClass({
	get(host) {
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
					throw new WikiVariablesFetchError({
						code: response.status || 503
					}).withAdditionalData({
						host,
						responseBody: response.json(),
						url
					});
				}

				const contentType = response.headers.get('content-type');

				if (contentType && contentType.indexOf('application/json') !== -1) {
					return response.json();
				} else {
					throw new NonJsonApiResponseError().withAdditionalData({
						redirectLocation: response.url
					});
				}

			}).
			then((response) => {
				if (!response.data.siteName) {
					response.data.siteName = 'Fandom powered by Wikia';
				}

				response.data.host = host;

				return response.data;
			})
			.catch((error) => {
				if (error.name === 'NonJsonApiResponseError') {
					throw error;
				}

				throw new WikiVariablesFetchError({
					code: error.code || 503
				})
					.withPreviousError(error)
					.withAdditionalData({
						host,
						url
					});
			});
	}
});

export default WikiVariablesModel;
