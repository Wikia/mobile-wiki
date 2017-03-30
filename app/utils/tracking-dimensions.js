import fetch from './mediawiki-fetch';
import {buildUrl} from './url';

export function getAndPutTrackingDimensionsToShoebox(fastboot, currentUser, host, model) {
	return fetch(
		buildUrl({
			host,
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getTrackingDimensions',
				title: model.get('title'),
				isanon: !currentUser.isAuthenticated,
				format: 'json'
			}
		})
	)
		.then((response) => response.json())
		.then(({dimensions}) => {
			if (dimensions) {
				fastboot.get('shoebox').put('trackingDimensionsForFirstPage', dimensions);
			}

			return model;
		});
}
