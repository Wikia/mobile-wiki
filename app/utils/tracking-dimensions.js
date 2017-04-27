import Ember from 'ember';
import fetch from './mediawiki-fetch';
import {buildUrl} from './url';
import {getService} from '../utils/application-instance';
import {getFetchErrorMessage, TrackingDimensionsFetchError} from '../utils/errors';

export function getAndPutTrackingDimensionsToShoebox(isAnon, host, title, fastboot) {
	// TODO XW-3310 rethink how we share application instance
	// const fastboot = getService('fastboot');
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
				return response.json()
					.then(({dimensions}) => {
						if (dimensions) {
							fastboot.get('shoebox').put('trackingDimensionsForFirstPage', dimensions);
						}
					});
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
		.catch((error) => getService('logger').error('getTrackingDimensions error: ', error));
}
