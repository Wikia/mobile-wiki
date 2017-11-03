import EmberObject from '@ember/object';
import {getFetchErrorMessage, DesignSystemFetchError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

export default EmberObject.extend({
	fetchAll(host, wikiId, language) {
		const url = buildUrl({
			host,
			path: `/api/v1/design-system/wikis/${wikiId}/${language}/`,
			wiki: 'www'
		});

		return fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					return getFetchErrorMessage(response).then((responseBody) => {
						throw new DesignSystemFetchError({
							code: 503
						}).withAdditionalData({
							responseStatus: response.status,
							responseBody,
							requestUrl: url,
							responseUrl: response.url
						});
					});
				}
			})
			.then((navigationData) => {
				return {
					globalFooter: navigationData['global-footer'],
					globalNavigation: navigationData['global-navigation']
				};
			});
	}
});
