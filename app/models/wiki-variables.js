import Ember from 'ember';
import {defineError} from 'ember-exex/error';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

const WikiVariablesModel = Ember.Object.extend({});

export const WikiVariablesFetchError = defineError({
	name: 'WikiVariablesFetchError',
	message: `Wiki variables couldn't be fetched`,
	code: 503
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
					throw Error(response.statusText)
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
							throw Error(navigationApiResponse.statusText);
						}

						return navigationApiResponse.json()
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
				throw new WikiVariablesFetchError()
					.withPreviousError(error)
					.withAdditionalData({
						host,
						url
					});
			});
	}
});

export default WikiVariablesModel;
