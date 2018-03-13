(function () {
	var getterAdsQueue = [];
	var isAdsListening = false;
	var adsLoaded = false;

	window.getInstantGlobal('wgSitewideDisableAdsOnMercury', (wgSitewideDisableAdsOnMercury) => {

		if (wgSitewideDisableAdsOnMercury || (new URL(document.location)).searchParams.get('noexternals')) {
			return;
		}

		const wikiVariables = window.M.getFromHeadDataStore('wikiVariables');

		window.M.loadScript(
			wikiVariables.cdnRootUrl + '/__am/' + wikiVariables.cacheBuster + '/groups/-/mercury_ads_js',
			true,
			function () {
				window.document.dispatchEvent(new Event('adsScriptLoaded'));
			}
		);
	});

	window.waitForAds = function (callback) {
		function onAdsLoaded() {
			adsLoaded = true;

			getterAdsQueue.forEach(function (queuedCallback) {
				queuedCallback();
			});

			getterAdsQueue = [];
		}

		if (adsLoaded) {
			callback();
		} else {
			getterAdsQueue.push(callback);

			if (!isAdsListening) {
				document.addEventListener('adsScriptLoaded', onAdsLoaded, {once: true});
				isAdsListening = true;
			}
		}
	};
})();
