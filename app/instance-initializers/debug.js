import config from '../config/environment';

/**
 * @param {*} applicationInstance
 *
 * @returns {void}
 */
export function initialize(applicationInstance) {
	const fastboot = applicationInstance.lookup('service:fastboot');
	let debug = config.environment === 'dev';

	// turn on debugging with querystring ?debug=1
	if ((fastboot.get('isFastBoot') && fastboot.get('request.queryParams.debug') === '1') ||
		!fastboot.get('isFastBoot') && window.location.search.match(/debug=1/)
	) {
		debug = true;
	}

	applicationInstance.setProperties({
		LOG_ACTIVE_GENERATION: debug,
		LOG_VIEW_LOOKUPS: debug,
		LOG_TRANSITIONS: debug,
		LOG_TRANSITIONS_INTERNAL: debug,
		LOG_RESOLVER: debug,
	});
}

export default {
	after: 'config',
	name: 'debug',
	initialize
};
