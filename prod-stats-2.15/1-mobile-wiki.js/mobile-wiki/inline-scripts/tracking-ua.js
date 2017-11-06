define('mobile-wiki/inline-scripts/tracking-ua', [], function () {
	'use strict';

	(function (M) {
		if (M.getFromShoebox('runtimeConfig.noExternals') || M.getFromShoebox('serverError')) {
			return;
		}

		var dimensions = M.getFromShoebox('trackingDimensionsForFirstPage');

		if (dimensions) {
			var ua = M.tracker.UniversalAnalytics;

			if (ua.initialize(dimensions)) {
				ua.trackPageView({
					3: dimensions[3],
					14: dimensions[14],
					19: dimensions[19],
					25: dimensions[25]
				});
			}
		}
	})(window.M);
});