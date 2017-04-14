import Ember from 'ember';
import fetch from './mediawiki-fetch';
import {buildUrl} from './url';

const { Logger } = Ember;

export function getAndPutTrackingDimensionsToShoebox(fastboot, isAnon, host, title) {
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
