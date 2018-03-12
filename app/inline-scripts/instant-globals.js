(function () {
	var gettersQueue = [];
	var getterAdsQueue = [];
	var isListening = false;
	var isAdsListening = false;

	window.onInstantGlobalsLoaded = function () {
		window.document.dispatchEvent(new Event('instantGlobalsLoaded'));
	};

	window.onInstantGlobalsError = function () {
		window.Wikia = window.Wikia || {};
		window.Wikia.InstantGlobals = {};
		window.document.dispatchEvent(new Event('instantGlobalsLoaded'));
	};

	window.getInstantGlobal = function (key, callback) {
		function onInstantGlobalsLoaded() {
			gettersQueue.forEach(function (getter) {
				getter.callback(window.Wikia.InstantGlobals[getter.key]);
			});

			gettersQueue = [];
		}

		if (window.Wikia && window.Wikia.InstantGlobals) {
			callback(window.Wikia.InstantGlobals[key]);
		} else {
			gettersQueue.push({key: key, callback: callback});

			if (!isListening) {
				document.addEventListener('instantGlobalsLoaded', onInstantGlobalsLoaded, {once: true});
				isListening = true;
			}
		}
	};

	window.getInstantGlobal('wgSitewideDisableAdsOnMercury', (wgSitewideDisableAdsOnMercury) => {
		console.log('load ads');

		if (wgSitewideDisableAdsOnMercury || (new URL(document.location)).searchParams.get('noexternals')) {
			console.log(wgSitewideDisableAdsOnMercury, (new URL(document.location)).searchParams.get('noexternals'));

			return;
		}

		const script = document.createElement('script');
		const node = document.getElementsByTagName('script')[0];
		const wikiVariables = window.M.getFromHeadDataStore('wikiVariables');

		script.async = true;
		script.type = 'text/javascript';
		script.src = wikiVariables.cdnRootUrl + '/__am/' + wikiVariables.cacheBuster + '/groups/-/mercury_ads_js';
		script.onload = function() {
			window.document.dispatchEvent(new Event('adsScriptLoaded'));
		};


		node.parentNode.insertBefore(script, node);
	});

	window.waitForAds = function (callback) {
		function onAdsLoaded() {
			getterAdsQueue.forEach(function (queuedCallback) {
				queuedCallback();
			});

			getterAdsQueue = [];
		}

		if (window.require) {
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
