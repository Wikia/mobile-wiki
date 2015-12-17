/**
 * @param {*} applicationInstance
 *
 * @returns {void}
 */
export function initialize(applicationInstance) {
	let debug = M.prop('environment') === 'dev';

	// turn on debugging with querystring ?debug=1
	if (window.location.search.match(/debug=1/)) {
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
	name: 'debug',
	initialize
};
