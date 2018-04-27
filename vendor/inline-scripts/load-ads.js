(function () {
	var assetUrls = {
		adEngineScript: '/mobile-wiki/assets/adengine/ad-engine.global.js',
		adProductsScript: '/mobile-wiki/assets/adengine/ad-products.global.js',
		geoScript: '/mobile-wiki/assets/adengine/geo.global.js'
	};

	var getterAdsQueue = [];
	var adsLoaded = false;
	var adEngine3Loaded = false;
	var loadScript = function (url, cb) {
		window.M.loadScript(url, true, cb);
	};

	function onAdsLoaded() {
		adsLoaded = true;

		getterAdsQueue.forEach(function (queuedCallback) {
			queuedCallback(adEngine3Loaded);
		});

		getterAdsQueue = [];
	}

	window.getInstantGlobals(function (instantGlobals) {
		var noExternalsSearchParam = (window.location.search.match(/noexternals=([a-z0-9]+)/i) || [])[1];

		if (
			instantGlobals.wgSitewideDisableAdsOnMercury ||
			noExternalsSearchParam === '1' ||
			noExternalsSearchParam === 'true'
		) {
			return;
		}

		var wikiVariables = window.M.getFromHeadDataStore('wikiVariables');

		// TODO#1: use instant global
		// Possibly easiest check for proper geo
		// Note that at this point we don't have geo module
		// TODO#2: load adProducts* script in parallel
		if (true) {
			loadScript(assetUrls.adEngineScript, function onEngineLoaded() {
				loadScript(assetUrls.adProductsScript, function onProductsLoaded() {
					loadScript(assetUrls.geoScript, function onGeoLoaded() {
						adEngine3Loaded = true;
						onAdsLoaded();
					});
				});
			});
		} else {
			var mercuryAdsJsUrl = wikiVariables.cdnRootUrl + '/__am/' + wikiVariables.cacheBuster + '/groups/-/mercury_ads_js';
			loadScript(mercuryAdsJsUrl, onAdsLoaded);
		}
	});

	window.waitForAds = function (callback) {
		if (adsLoaded) {
			window.setTimeout(callback, 0, adEngine3Loaded);
		} else {
			getterAdsQueue.push(callback);
		}
	};
})();
