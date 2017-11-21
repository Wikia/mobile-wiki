(function () {
	var adsUrl = M.getFromShoebox('cdnRootUrl') + '/__am/' + M.getFromShoebox('acheBuster') + '/groups/-/mercury_ads_js',
		Ads = Mercury.Modules.Ads.getInstance();

	Ads.init(adsUrl);
})();
