import request from 'ember-ajax/request';
import {buildUrl} from './url';

export function putTrackingDimensionsToShoebox(fastboot, currentUser, host, model) {
	return request(
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
	).then(({dimensions}) => {
		if (dimensions) {
			fastboot.get('shoebox').put('trackingDimensionsForFirstPage', dimensions);
		}

		return model;
	});
}
