import EmberObject from '@ember/object';
import {inject as service} from '@ember/service';
import {getFetchErrorMessage, DesignSystemFetchError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';

export default EmberObject.extend({
	wikiUrls: service(),

	fetchAll(host, wikiId, language) {
		const url = this.get('wikiUrls').build({
			host,
			path: '/wikia.php',
			query: {
				controller: 'DesignSystemApi',
				method: 'getAllElements',
				product: 'wikis',
				id: wikiId,
				lang: language
			}
		});

		return fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					return getFetchErrorMessage(response).then(() => {
						throw new DesignSystemFetchError({
							code: 503
						}).withAdditionalData({
							responseStatus: response.status,
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
