(function (M) {
	if (M.getFromHeadDataStore('noExternals')) {
		return;
	}

	const trackingData = document.querySelector('#shoebox-trackingData');

	if (trackingData) {
		const shoeboxTrackingData = JSON.parse(trackingData.innerHTML);

		M.tracker.Internal.trackPageView({
			a: shoeboxTrackingData.articleId,
			n: shoeboxTrackingData.namespace
		});
	}
})(window.M);
