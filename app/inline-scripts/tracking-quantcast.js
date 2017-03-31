(function (M) {
	var prefix = document.location.protocol === 'https:' ? 'https://secure' : 'http://edge';

	if (M.getFromShoebox('runtimeConfig.noExternals') || M.getFromShoebox('serverError')) {
		window.trackQuantcastPageView = function () {};
		return;
	}

	M.loadScript(prefix + '.quantserve.com/quant.js?' + Math.random(), true);

	window.trackQuantcastPageView = function () {
		window._qevents = window._qevents || [];

		if (window.__qc) {
			window.__qc.qpixelsent = [];
		}

		window._qevents.push({
			qacct: M.getFromShoebox('tracking.quantcast'),
			labels: 'Category.MobileWeb.Mercury'
		});

		console.info('Track pageView: Quantserve');
	};

	window.trackQuantcastPageView();
})(window.M);
