(function () {
	var adsUrl = M.getFromShoebox('wikiVariables.cdnRootUrl') + '/__am/' + M.getFromShoebox('wikiVariables.cacheBuster') + '/groups/-/mercury_ads_js',
		Ads = Mercury.Modules.Ads.getInstance(),
		adsContext = M.getFromShoebox('wikiPage.data.adsContext');

	Mercury.Modules.Ads.getInstance().currentAdsContext = adsContext;
	Ads.init(adsUrl);
	//This is a hack to force setting context before ember loads
	Ads.reloadAfterTransition(adsContext);
})();
