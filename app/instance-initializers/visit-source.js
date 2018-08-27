import config from '../config/environment';

/**
 * @returns {void}
 */
export function initialize() {
	if (typeof FastBoot !== 'undefined') {
		return;
	}

	if (typeof VisitSource === 'function') {
		(new VisitSource('WikiaSessionSource', config.APP.cookieDomain)).checkAndStore();
		(new VisitSource('WikiaLifetimeSource', config.APP.cookieDomain, false)).checkAndStore();
	}
}

export default {
	after: 'config',
	name: 'visit-source',
	initialize,
};
