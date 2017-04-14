import Ember from 'ember';
import {DesignSystemFetchError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

const {
	Object: EmberObject
} = Ember;

const NavigationModel = EmberObject.extend({});


NavigationModel.reopenClass({
	getAll(host, wikiId, language) {
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
					const contentType = response.headers.get('content-type');
					const throwError = (responseBody) => {
						const error = new DesignSystemFetchError({
							code: 503
						}).withAdditionalData({
							responseStatus: response.status,
							responseBody,
							requestUrl: url,
							responseUrl: response.url
						});

						throw error;
					};

					if (contentType && contentType.indexOf('application/json') !== -1) {
						return response.json().then(throwError);
					} else {
						return response.text().then(throwError);
					}
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

export default NavigationModel;
