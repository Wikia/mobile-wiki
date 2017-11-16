(function() {
	var wikiVariables = M.getFromShoebox('wikiVariables'),
		cdnRootUrl = wikiVariables.cdnRootUrl,
		cacheBuster = wikiVariables.cacheBuster,
		adsUrl = cdnRootUrl + '/__am/' + cacheBuster + '/groups/-/mercury_ads_js',
		Ads = Mercury.Modules.Ads.getInstance(),
		JWPlayerVideoAds = Mercury.Modules.JWPlayerVideoAds;

	Ads.init(adsUrl);

	window.Mercury.Modules.Ads.initialized = true;
	window.Mercury.Modules.Ads.currentAdsContext = M.getFromShoebox('adsContext');

	Ads.reloadAfterTransition(M.getFromShoebox('adsContext'));


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
					title: 'title',
					playlist: [
						{
							mediaid: "FYykS9se",
							description: "My video description",
							pubdate: 1500547843,
							tags: "TV,Game of Thrones",
							image: "https://cdn.jwplayer.com/thumbs/FYykS9se-720.jpg",
							title: "Test video",
							title1: "title",
							sources: [
								{
									type: "application/vnd.apple.mpegurl",
									file: "https://cdn.jwplayer.com/manifests/FYykS9se.m3u8"
								},
								{
									width: 320,
									height: 180,
									type: "video/mp4",
									file: "https://cdn.jwplayer.com/videos/FYykS9se-TI0yeHZW.mp4",
									label: "180p"
								},
								{
									width: 480,
									height: 270,
									type: "video/mp4",
									file: "https://cdn.jwplayer.com/videos/FYykS9se-DnzUC89Y.mp4",
									label: "270p"
								},
								{
									width: 720,
									height: 406,
									type: "video/mp4",
									file: "https://cdn.jwplayer.com/videos/FYykS9se-xhZUqUI6.mp4",
									label: "406p"
								},
								{
									width: 1280,
									height: 720,
									type: "video/mp4",
									file: "https://cdn.jwplayer.com/videos/FYykS9se-1lt3rSsE.mp4",
									label: "720p"
								},
								{
									type: "audio/mp4",
									file: "https://cdn.jwplayer.com/videos/FYykS9se-LiJWxqIn.m4a",
									label: "AAC Audio"
								},
								{
									width: 1920,
									height: 1080,
									type: "video/mp4",
									file: "https://cdn.jwplayer.com/videos/FYykS9se-cSpmBcaY.mp4",
									label: "1080p"
								}
							],
							tracks: [
								{
									kind: "thumbnails",
									file: "https://cdn.jwplayer.com/strips/FYykS9se-120.vtt"
								}
							],
							link: "https://cdn.jwplayer.com/previews/FYykS9se",
							duration: 253,
							pixel: "http://via.placeholder.com/1x1"
						}
					]
				},
				// logger: {
				// 	clientName: 'mobile-wiki'
				// },
				// lang: this.params.lang
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
			.then(initializePlayer);

	}


	createPlayer();
})();
