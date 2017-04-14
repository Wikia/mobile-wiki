import fetch from './mediawiki-fetch';
import {buildUrl} from './url';

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
		.then((response) => response.json())
		.then(({dimensions}) => {
			if (dimensions) {
				fastboot.get('shoebox').put('trackingDimensionsForFirstPage', dimensions);
			}
		});
}
