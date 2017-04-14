import Ember from 'ember';
import fetch from './mediawiki-fetch';
import {buildUrl} from './url';
import applicationInstance from '../utils/application-instance';
import {TrackingDimensionsFetchError} from '../utils/errors';

const {Logger} = Ember;

export function getAndPutTrackingDimensionsToShoebox(isAnon, host, title) {
	const fastboot = applicationInstance.instance.lookup('service:fastboot');
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
				const contentType = response.headers.get('content-type');
				const throwError = (responseBody) => {
					const error = new TrackingDimensionsFetchError({
						code: response.status
					})
						.withAdditionalData({
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
		.catch((error) => Logger.error('getTrackingDimensions error: ', error));
}
