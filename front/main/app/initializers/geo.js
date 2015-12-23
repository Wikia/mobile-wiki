import Ember from 'ember';

/**
 * A "Geo" cookie is set by Fastly on every request.
 * If you run mercury app on your laptop (e.g. development), the cookie won't be automatically present; hence,
 * we set fake geo cookie values for 'dev'.
 *
 * @returns {void}
 */
export function initialize() {
	const geoCookie = $.cookie('Geo');

	if (geoCookie) {
		M.prop('geo', JSON.parse(geoCookie));
	} else if (M.prop('environment') === 'dev') {
		M.prop('geo', {
			country: 'wikia-dev-country',
			continent: 'wikia-dev-continent'
		});
	} else {
		Ember.debug('Geo cookie is not set');
	}
}


export default {
	name: 'geo',
	initialize
};
