(function (M) {
	if (M.getFromHeadDataStore('noExternals')) {
		return;
	}

	const trackingDataShoebox = document.querySelector('#shoebox-trackingData');

	if (trackingDataShoebox) {
		const trackingData = JSON.parse(trackingDataShoebox.innerHTML);

		M.trackingQueue.push(() => M.tracker.Internal.trackPageView({
			a: trackingData.articleId,
			n: trackingData.namespace
		}));
	}
})(window.M);
