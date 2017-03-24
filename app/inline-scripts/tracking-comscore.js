(function () {
	var prefix = (document.location.protocol === 'https:' ? 'https://sb' : 'http://b');

	if (M.getFromShoebox('runtimeConfig.noExternals')) {
		window.trackComscorePageView = function () {};
		return;
	}

	M.loadScript(prefix + '.scorecardresearch.com/beacon.js', false);

	window._comscore = window._comscore || [];

	window.trackComscorePageView = function () {
		var config = M.getFromShoebox('tracking.comscore') || {};

		window._comscore.push({
			c1: '2',
			c2: config.id,
			options: {
				url_append: config.keyword + '=' + config.c7Value
			}
		});

		/*
		 Whenever comscore script loads it'll send all the events from the _comscore array
		 but on the second page view in a session we don't want to load the script once again
		 that is why we have to call purge method here
		 It'll make sure that whatever is in _comscore gets send
		 */
		if (window.COMSCORE) {
			if (window.COMSCORE.purge) {
				window.COMSCORE.purge();
			}
		}

		console.info('Track pageView: Comscore');
	};

	window.trackComscorePageView();
})();
