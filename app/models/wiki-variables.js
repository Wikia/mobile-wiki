import Ember from 'ember';
import fetch from '../utils/wikia-fetch';
import {buildUrl} from '../utils/url';

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
			.then((response) => response.json())
			.then(({data}) => {
				return fetch(
					buildUrl({
						host,
						path: `/api/v1/design-system/wikis/${data.id}/${data.language.content}/`,
						wiki: 'www'
					})
				)
					.then((navigationApiResponse) => navigationApiResponse.json())
					.then((navigationData) => {
						if (!data.siteName) {
							data.siteName = 'Fandom powered by Wikia';
						}

						data.host = host;
						data.globalFooter = navigationData['global-footer'];
						data.globalNavigation = navigationData['global-navigation'];

						return data;
					});
			});
	}
});

export default WikiVariablesModel;
