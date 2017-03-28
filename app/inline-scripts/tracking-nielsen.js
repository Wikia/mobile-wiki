(function (M) {
	var config = M.getFromShoebox('tracking.nielsen') || {};

	function sendNielsenPageView() {
		var assetidRnd, globalParams;

		if (!window.NOLCMB || !window.NOLCMB.getInstance) {
			return;
		}

		assetidRnd = Math.round(1000000 * Math.random());
		globalParams = {
			sfcode: 'dcr',
			apid: config.apid,
			apn: 'wikiaCOM'
		};

		window.gg1 = window.NOLCMB.getInstance(globalParams);
		window.staticmeta = {
			type: 'static',
			assetid: assetidRnd,
			section: config.section,
			segA: config.dbName,
			segB: '',
			segC: ''
		};

		window.gg1.ggInitialize(globalParams);
		window.gg1.ggPM('staticstart', window.staticmeta);

		console.info('Track pageView: Nielsen');
	}

	window.trackNielsenPageView = function () {
		if (M.getFromShoebox('runtimeConfig.noExternals') || !config.enabled) {
			return;
		}

		if (typeof(config.apid) !== 'string' || config.apid === 'FIXME') {
			throw 'Invalid Nielsen apid';
		}

		delete window.NOLCMB;

		M.loadScript(
			'http://secure-dcr.imrworldwide.com/novms/js/2/ggcmb500.js?' + Date.now(),
			true,
			sendNielsenPageView
		);
	};

	window.trackNielsenPageView();
})(window.M);
