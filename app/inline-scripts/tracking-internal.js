(function (M) {
	if (M.getFromHeadDataStore('noExternals')) {
		return;
	}

	const shoeboxTrackingData = JSON.parse(document.querySelector('#shoebox-trackingData').innerHTML);

	M.tracker.Internal.trackPageView({
		a: shoeboxTrackingData.articleId,
		n: shoeboxTrackingData.namespace
	});
})(window.M);
