define('mobile-wiki/instance-initializers/debug', ['exports', 'mobile-wiki/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initialize = initialize;


	/**
  * @param {*} applicationInstance
  *
  * @returns {void}
  */
	function initialize(applicationInstance) {
		var fastboot = applicationInstance.lookup('service:fastboot');
		var debug = _environment.default.environment === 'development';

		// turn on debugging with querystring ?debug=1
		if (fastboot.get('isFastBoot') && fastboot.get('request.queryParams.debug') === '1' || !fastboot.get('isFastBoot') && window.location.search.match(/debug=1/)) {
			debug = true;
		}

		applicationInstance.setProperties({
			LOG_ACTIVE_GENERATION: debug,
			LOG_VIEW_LOOKUPS: debug,
			LOG_TRANSITIONS: debug,
			LOG_TRANSITIONS_INTERNAL: debug,
			LOG_RESOLVER: debug
		});
	}

	exports.default = {
		after: 'config',
		name: 'debug',
		initialize: initialize
	};
});