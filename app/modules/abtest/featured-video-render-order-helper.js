import DomHelper from '../dom-helper';
import Ads from '../ads';
import JWPlayerVideoAds from '../video-players/jwplayer-video-ads';

const featuredVideoData = M.getFromShoebox('wikiPage.data.article.featuredVideo.embed'),
	wikiVariables = M.getFromShoebox('applicationData.wikiVariables');

let featuredVideoPlayer,
	mobileWikiInitialized = false;

function initializeMobileWiki() {
	if (!mobileWikiInitialized) {
		mobileWikiInitialized = true;
		if (typeof FastBoot === 'undefined' && M.getFromShoebox('serverError')) {
			// No need to load Ember in browser on server error page
			return;
		}
		M.loadScript('/mobile-wiki/assets/vendor.js', false, false, 'anonymous');
		M.loadScript('/mobile-wiki/assets/mobile-wiki.js', false, false, 'anonymous');
	}
}

function onCreate(bidParams, player) {
	var adsInstance = Ads.getInstance();
	if (adsInstance.jwPlayerAds && adsInstance.jwPlayerMoat) {
		adsInstance.jwPlayerAds(player, bidParams);
		adsInstance.jwPlayerMoat(player);
	}

	player.once('adImpression', function () {
		initializeMobileWiki();
	});

	player.once('videoStart', function () {
		initializeMobileWiki();
	});

	setFeaturedVideoPlayer(player);
}

export function updateFeaturedVideoPosition() {
	const videoOffset = DomHelper.offset(document.querySelector('.article-featured-video'));
	document.querySelector('#pre-featured-video-wrapper').style.top = `${videoOffset.top}px`;
}

export function setFeaturedVideoPlayer(player) {
	featuredVideoPlayer = player;
}

export function destroyPlayer() {
	if (featuredVideoPlayer) {
		featuredVideoPlayer.remove();
		featuredVideoPlayer = null;
	}
}

export function createPlayer() {
	Ads.getInstance().waitForReady()
	.then(() => {
		(new JWPlayerVideoAds({ noAds: false })).getConfig()
	})
	.then(initializePlayer.bind(this));
}

export function initializePlayer(bidParams) {
	destroyPlayer();
	window.wikiaJWPlayer(
		'pre-featured-video',
		{
			tracking: {
				track(data) {
					// M.tracker.UniversalAnalytics.track(
					// 	data.category, data.action, data.label, data.value
					// );
					// M.tracker.Internal.track('special/videoplayerevent', data);
				},
				setCustomDimension: function () {
				}//M.tracker.UniversalAnalytics.setDimension,
				// comscore: config.environment === 'production'
			},
			settings: {
				showAutoplayToggle: true,
				showCaptions: true
			},
			// selectedCaptionsLanguage: this.params.selectedCaptionsLanguage,
			autoplay: true,
			mute: true,
			related: {
				time: 3,
				playlistId: featuredVideoData.jsParams.recommendedVideoPlaylist || 'Y2RWCKuS',
				autoplay: true
			},
			videoDetails: {
				description: featuredVideoData.jsParams.playlist[0].description,
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
