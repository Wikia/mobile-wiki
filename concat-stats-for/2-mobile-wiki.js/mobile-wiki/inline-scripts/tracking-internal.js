define('mobile-wiki/inline-scripts/tracking-internal', [], function () {
	'use strict';

	(function (M) {
		if (M.getFromShoebox('runtimeConfig.noExternals') || M.getFromShoebox('serverError')) {
			return;
		}

		M.tracker.Internal.trackPageView({
			a: M.getFromShoebox('wikiPage.data.details.id'),
			n: M.getFromShoebox('wikiPage.data.ns')
		});
	})(window.M);
});