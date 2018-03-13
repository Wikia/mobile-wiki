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
		if (wgSitewideDisableAdsOnMercury || (new URL(document.location)).searchParams.get('noexternals')) {
			return;
		}

		const wikiVariables = window.M.getFromHeadDataStore('wikiVariables');

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
