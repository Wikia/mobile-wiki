import {inject as service} from '@ember/service';
import EmberObject from '@ember/object';
import {getFetchErrorMessage, TrackingDimensionsFetchError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

export default EmberObject.extend({
	fastboot: service(),
	logger: service(),

	fetch(isAnon, host, title, langPath) {
		const url = buildUrl({
			host,
			langPath,
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
					return getFetchErrorMessage(response).then(() => {
						throw new TrackingDimensionsFetchError({
							code: response.status
						}).withAdditionalData({
							requestUrl: url,
							responseUrl: response.url
						});
					});
				}
			})
			.catch((error) => this.get('logger').error('getTrackingDimensions error: ', error));
	}
});
