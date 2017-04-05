(function (M, Wikia) {
	var enableTracking = !M.getFromShoebox('runtimeConfig.noExternals') && !M.getFromShoebox('serverError'),
		triedToTrackWithoutLoadedLibrary = false,
		ivw3 = M.getFromShoebox('tracking.ivw3') || {};

	if (
		enableTracking &&
		window.Wikia && Wikia.InstantGlobals &&
		!Wikia.InstantGlobals.wgSitewideDisableIVW3 &&
		ivw3 && ivw3.countries &&
		typeof ivw3.countries.indexOf === 'function' &&
		ivw3.countries.indexOf(M.geo.country) !== -1
	) {
		M.loadScript('https://script.ioam.de/iam.js', true, function () {
			if (triedToTrackWithoutLoadedLibrary) {
				window.trackIVW3PageView();
			}
		});
	}

	window.trackIVW3PageView = function () {
		if (!enableTracking) {
			return;
		}

		if (window.iom) {
			window.iam_skiponload = true;
			window.iom.c({
				st: 'wikia',
				cp: ivw3.cmKey,
				sv: 'mo'
			}, 2);
			console.info('Track pageView: IVW3');
		} else {
			triedToTrackWithoutLoadedLibrary = true;
		}
	};
})(window.M, window.Wikia);
