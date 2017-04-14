import Ember from 'ember';
import fetch from './mediawiki-fetch';
import {buildUrl} from './url';
import applicationInstance from '../utils/application-instance';

const {Logger} = Ember;

export function getAndPutTrackingDimensionsToShoebox(isAnon, host, title) {
	const fastboot = applicationInstance.instance.lookup('service:fastboot');

	return fetch(
		buildUrl({
			host,
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getTrackingDimensions',
				title,
				isanon: isAnon,
				format: 'json'
			}
		})
	)
		.then((response) => {
			if (response.ok) {
				return response.json()
					.then(({dimensions}) => {
						if (dimensions) {
							fastboot.get('shoebox').put('trackingDimensionsForFirstPage', dimensions);
						}
					});
			} else {
				Logger.error('getTrackingDimensions error: ', response);
			}
		})
		.catch((error) => Logger.error('getTrackingDimensions error: ', error));
}
