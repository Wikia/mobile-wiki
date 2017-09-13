import config from '../../config/environment';

/**
 * @returns {void}
 */
export function initialize() {
	if (typeof FastBoot === 'undefined') {
		if (typeof VisitSource === 'function') {
			(new VisitSource('WikiaSessionSource', config.cookieDomain)).checkAndStore();
			(new VisitSource('WikiaLifetimeSource', config.cookieDomain, false)).checkAndStore();
		}
	}
}

export default {
	after: 'config',
	name: 'visit-source',
	initialize
};
