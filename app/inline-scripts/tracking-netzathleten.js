(function () {
	var allowedCountries = [];
	var geo = M.geo || {};
	var config = M.getFromHeadDataStore('tracking.netzathleten') || {};
	var isLoggedIn = Boolean(M.getFromHeadDataStore('userId'));

	function initializeNetzAthletenTracking() {
		var script = document.createElement('script');

		script.id = 'Wikia_container';
		script.src = config.url;
		script.addEventListener('load', function () {
			window.naMediaAd.setValue('homesite', Boolean(M.getFromHeadDataStore('isMainPage')));
		});
		document.head.appendChild(script);
	}

	if (
		!M.getFromHeadDataStore('noExternals') &&
		config.enabled &&
		config.url &&
		!isLoggedIn &&
		window.Wikia
	) {
		window.getInstantGlobal('wgAdDriverNetzAthletenCountries', function (allowedCountries) {
			allowedCountries = allowedCountries || [];

			if (
				allowedCountries.indexOf(geo.country) !== -1 ||
				allowedCountries.indexOf('XX') !== -1
			) {
				initializeNetzAthletenTracking();
			}

		});
	}
})();
