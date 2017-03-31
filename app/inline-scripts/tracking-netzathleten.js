(function () {
	var allowedCountries = [];
	var geo = M.geo || {};
	var config = M.getFromShoebox('tracking.netzathleten') || {};
	var isLoggedIn = Boolean(M.getFromShoebox('userData'));

	function initializeNetzAthletenTracking() {
		var script = document.createElement('script');

		script.id = 'Wikia_container';
		script.src = config.url;
		script.addEventListener('load', function () {
			window.naMediaAd.setValue('homesite', Boolean(M.getFromShoebox('wikiPage.data.isMainPage')));
		});
		document.head.appendChild(script);
	}

	if (
		!M.getFromShoebox('runtimeConfig.noExternals') &&
		!M.getFromShoebox('serverError') &&
		config.enabled &&
		config.url &&
		!isLoggedIn &&
		window.Wikia
	) {
		allowedCountries = window.Wikia.InstantGlobals.wgAdDriverNetzAthletenCountries || [];

		if (
			allowedCountries.indexOf(geo.country) !== -1 ||
			allowedCountries.indexOf('XX') !== -1
		) {
			initializeNetzAthletenTracking();
		}
	}
})();
