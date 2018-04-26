import {inject as service} from '@ember/service';
import EmberObject from '@ember/object';
import {getFetchErrorMessage, TrackingDimensionsFetchError} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';

export default EmberObject.extend({
	fastboot: service(),
	logger: service(),
	wikiUrls: service(),

	fetch(isAnon, host, title) {
		const url = this.get('wikiUrls').build({
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

		this.get('logger').error('trackingDimensions url', url);

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
