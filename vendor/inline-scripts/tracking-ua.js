(function (M) {
	if (M.getFromHeadDataStore('noExternals')) {
		return;
	}

	const dimensions = M.getFromHeadDataStore('trackingDimensions');

	if (dimensions) {
		const ua = M.tracker.UniversalAnalytics;

		window.onABTestLoaded(function () {
			if (ua.initialize(dimensions)) {
				ua.trackPageView({
					3: dimensions[3],
					14: dimensions[14],
					19: dimensions[19],
					25: dimensions[25]
				});
			}
		});
	}
})(window.M);
