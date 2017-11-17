(function() {
	var wikiVariables = M.getFromShoebox('wikiVariables'),
		featuredVideoData = M.getFromShoebox('wikiPage.data.article.featuredVideo.embed'),
		cdnRootUrl = wikiVariables.cdnRootUrl,
		cacheBuster = wikiVariables.cacheBuster,
		adsUrl = cdnRootUrl + '/__am/' + cacheBuster + '/groups/-/mercury_ads_js',
		Ads = Mercury.Modules.Ads.getInstance(),
		JWPlayerVideoAds = Mercury.Modules.JWPlayerVideoAds,
		adsContext = M.getFromShoebox('wikiPage.data.adsContext');

	Ads.init(adsUrl);

	window.Mercury.Modules.Ads.initialized = true;
	window.Mercury.Modules.Ads.currentAdsContext = adsContext;

	//This is a hack to force setting context before ember loads
	Ads.reloadAfterTransition(adsContext);

	function initializePlayer(bidParams) {
		window.wikiaJWPlayer(
			'pre-featured-video',
			{
				// tracking: {
				// 	track(data) {
				// 		data.trackingMethod = 'both';
				//
				// 		track(data);
				// 	},
				// 	setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
				// 	comscore: config.environment === 'production'
				// },
				// settings: {
				// 	showAutoplayToggle: true,
				// 	showCaptions: true
				// },
				// selectedCaptionsLanguage: this.params.selectedCaptionsLanguage,
				autoplay: true,
				mute: true,
				// related: {
				// 	time: 3,
				// 	playlistId: this.params.recommendedVideoPlaylist || 'Y2RWCKuS',
				// 	autoplay: true
				// },
				videoDetails: {
					description: 'test',
					title: featuredVideoData.jsParams.playlist[0].title,
					playlist: featuredVideoData.jsParams.playlist
				},
				logger: {
					clientName: 'mobile-wiki'
				},
				lang: wikiVariables.language.content
			},
			onCreate.bind(this, bidParams)
		);
	}

	function onCreate(bidParams, player) {
		var adsInstance = Ads;
		if (adsInstance.jwPlayerAds && adsInstance.jwPlayerMoat) {
			adsInstance.jwPlayerAds(player, bidParams);
			adsInstance.jwPlayerMoat(player);
		}
	}

	function createPlayer() {
		console.log('1');
		Ads.waitForReady()
			.then(() => {
				(new JWPlayerVideoAds({noAds: false})).getConfig()
				console.log('2');
			})
			.then(initializePlayer.bind(this));

	}


	createPlayer();
})();
