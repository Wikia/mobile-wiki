define('mobile-wiki/instance-initializers/performance-monitoring', ['exports', 'mobile-wiki/utils/track-perf'], function (exports, _trackPerf) {
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

		var firstRenderTime = window.firstRenderTime;

		// Send page performance stats after window is loaded
		// Since we load our JS async this code may execute post load event
		if (document.readyState === 'complete') {
			(0, _trackPerf.sendPagePerformance)();
		} else {
			Ember.$(window).on('load', _trackPerf.sendPagePerformance);
		}

		if (!Ember.isEmpty(firstRenderTime)) {
			(0, _trackPerf.trackPerf)({
				type: 'timer',
				name: 'firstRender',
				value: firstRenderTime
			});
		}
	}

	exports.default = {
		after: 'config',
		name: 'performance-monitoring',
		initialize: initialize
	};
});