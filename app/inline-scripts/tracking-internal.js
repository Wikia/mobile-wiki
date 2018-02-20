(function (M) {
	if (M.getFromHeadDataStore('noExternals')) {
		return;
	}

	M.tracker.Internal.trackPageView({
		a: M.getFromHeadDataStore('articleId'),
		n: M.getFromHeadDataStore('namespace')
	});
})(window.M);
