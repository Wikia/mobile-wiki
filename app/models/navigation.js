import EmberObject from '@ember/object';
import {getFetchErrorMessage, DesignSystemFetchError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

export default EmberObject.extend({
	fetchAll(host, wikiId, language) {
		const url = buildUrl({
			host,
			/* eslint-disable max-len */
			path: `/wikia.php?controller=DesignSystemApi&method=getAllElements&product=wikis&id=${wikiId}&lang=${language}`
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
