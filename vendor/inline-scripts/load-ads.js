(function () {
	var assetUrls = {
		adEngineScript: '/mobile-wiki/assets/adengine/ad-engine.global.js',
		adProductsScript: '/mobile-wiki/assets/adengine/ad-products.global.js',
		geoScript: '/mobile-wiki/assets/adengine/geo.global.js'
	};

	var getterAdsQueue = [];
	var adsLoaded = false;
	var adEngine3Loaded = false;
	var loadScript = function (url) {
		// TODO: Don't use this promise here
		return new Promise(function (resolve) {
			window.M.loadScript(url, true, resolve);
		});
	};


	function onAdsLoaded() {
		adsLoaded = true;

		getterAdsQueue.forEach(function (queuedCallback) {
			queuedCallback(adEngine3Loaded);
		});

		getterAdsQueue = [];
	}

	window.getInstantGlobals(function (instantGlobals) {
		var adsDisabled = instantGlobals.wgSitewideDisableAdsOnMercury;

		if (adsDisabled || (new URL(document.location)).searchParams.get('noexternals')) {
			return;
		}

		var wikiVariables = window.M.getFromHeadDataStore('wikiVariables');

		// TODO#1: use instant global
		// Possibly easiest check for proper geo
		// Note that at this point we don't have geo module
		// TODO#2: load adProducts* script in parallel
		if (true) {
			loadScript(assetUrls.adEngineScript)
				.then(function () {
					return loadScript(assetUrls.adProductsScript)
				})
				.then(function () {
					return loadScript(assetUrls.geoScript)
				})
				.then(function () {
					adEngine3Loaded = true;
					onAdsLoaded();
				});
		} else {
			var url = wikiVariables.cdnRootUrl + '/__am/' + wikiVariables.cacheBuster + '/groups/-/mercury_ads_js';
			loadScript(url)
				.then(onAdsLoaded);
		}
	});

	window.waitForAds = function (callback) {
		if (adsLoaded) {
			callback(adEngine3Loaded);
		} else {
			getterAdsQueue.push(callback);
		}
	};
})();
