(function () {
	var getterAdsQueue = [];
	var adsLoaded = false;

	function onAdsLoaded() {
		adsLoaded = true;

		getterAdsQueue.forEach(function (queuedCallback) {
			queuedCallback();
		});

		getterAdsQueue = [];
	}

	window.getInstantGlobal('wgSitewideDisableAdsOnMercury', function (wgSitewideDisableAdsOnMercury) {
		var noExternalsSearchParam = (window.location.search.match(/noexternals=([a-z0-9]+)/i) || [])[1];

		if (
			wgSitewideDisableAdsOnMercury ||
			noExternalsSearchParam === '1' ||
			noExternalsSearchParam === 'true'
		) {
			return;
		}

		var wikiVariables = window.M.getFromHeadDataStore('wikiVariables');

		window.M.loadScript(
			wikiVariables.cdnRootUrl + '/__am/' + wikiVariables.cacheBuster + '/groups/-/mercury_ads_js',
			true,
			onAdsLoaded
		);
	});

	window.waitForAds = function (callback) {
		if (adsLoaded) {
			callback();
		} else {
			getterAdsQueue.push(callback);
		}
	};
})();
