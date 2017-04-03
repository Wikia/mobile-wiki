import Ember from 'ember';
import {defineError} from 'ember-exex/error';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

const WikiVariablesModel = Ember.Object.extend({});

const WikiVariablesFetchError = defineError({
	name: 'WikiVariablesFetchError',
	message: `Wiki variables couldn't be fetched`
});

const DesignSystemFetchError = defineError({
	name: 'DesignSystemFetchError',
	message: `Design System data couldn't be fetched`
});

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

				return response.json()
			})
			.then(({data}) => {
				return fetch(
					buildUrl({
						host,
						path: `/api/v1/design-system/wikis/${data.id}/${data.language.content}/`,
						wiki: 'www'
					})
				)
					.then((navigationApiResponse) => {
						if (!navigationApiResponse.ok) {
							throw new DesignSystemFetchError({
								code: navigationApiResponse.status || 503
							}).withAdditionalData({
								host,
								response: navigationApiResponse.json(),
								url
							});
						}

						return navigationApiResponse.json();
					})
					.then((navigationData) => {
						if (!data.siteName) {
							data.siteName = 'Fandom powered by Wikia';
						}

						data.host = host;
						data.globalFooter = navigationData['global-footer'];
						data.globalNavigation = navigationData['global-navigation'];

						return data;
					});
			})
			.catch((error) => {
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
