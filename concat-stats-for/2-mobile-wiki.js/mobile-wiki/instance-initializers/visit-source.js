define('mobile-wiki/instance-initializers/visit-source', ['exports', 'mobile-wiki/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initialize = initialize;


	/**
  * @returns {void}
  */
	function initialize() {
		if (typeof FastBoot !== 'undefined') {
			return;
		}

		if (typeof VisitSource === 'function') {
			new VisitSource('WikiaSessionSource', _environment.default.cookieDomain).checkAndStore();
			new VisitSource('WikiaLifetimeSource', _environment.default.cookieDomain, false).checkAndStore();
		}
	}

	exports.default = {
		after: 'config',
		name: 'visit-source',
		initialize: initialize
	};
});