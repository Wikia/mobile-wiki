import {inject as service} from '@ember/service';
import EmberObject from '@ember/object';
import {getFetchErrorMessage, TrackingDimensionsFetchError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

export default EmberObject.extend({
	fastboot: service(),
	logger: service(),

	fetch(isAnon, host, title) {
		const url = buildUrl({
			host,
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getTrackingDimensions',
				title,
				isanon: isAnon,
				format: 'json'
			}
		});

		return fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					return getFetchErrorMessage(response).then((responseBody) => {
						throw new TrackingDimensionsFetchError({
							code: response.status
						}).withAdditionalData({
							responseBody,
							requestUrl: url,
							responseUrl: response.url
						});
					});
				}
			})
			.catch((error) => this.get('logger').error('getTrackingDimensions error: ', error));
	}
});
