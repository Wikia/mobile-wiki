import config from '../config/environment';

/**
 * @returns {void}
 */
export function initialize(applicationInstance) {
	const fastboot = applicationInstance.lookup('service:fastboot');

	if (!fastboot.get('isFastBoot') && typeof VisitSource === 'function') {
		(new VisitSource('WikiaSessionSource', config.cookieDomain)).checkAndStore();
		(new VisitSource('WikiaLifetimeSource', config.cookieDomain, false)).checkAndStore();
	}
}

export default {
	after: 'config',
	name: 'visit-source',
	initialize
};
