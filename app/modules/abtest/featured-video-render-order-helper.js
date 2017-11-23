import DomHelper from '../dom-helper';
import Ads from '../ads';
import JWPlayerVideoAds from '../video-players/jwplayer-video-ads';
import {track} from '../../utils/track';

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

export function createPlayer(params) {
	params.onCreate = onCreate;
	Ads.getInstance().waitForReady()
		.then((new JWPlayerVideoAds(params)).getConfig())
		.then(initializePlayer.bind(this, params));
}

export function initializePlayer(params, bidParams) {
	destroyPlayer();
	window.wikiaJWPlayer(
		'pre-featured-video',
		{
			tracking: {
				track(data) {
					data.trackingMethod = 'both';

					track(data);
				},
				setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
				// TODO comscore
				// comscore: config.environment === 'production'
			},
			settings: {
				showAutoplayToggle: true,
				showCaptions: true
			},
			selectedCaptionsLanguage: params.selectedCaptionsLanguage,
			autoplay: true,
			mute: true,
			related: {
				time: 3,
				playlistId: params.recommendedVideoPlaylist || 'Y2RWCKuS',
				autoplay: true
			},
			videoDetails: {
				description: params.playlist[0].description,
				title: params.playlist[0].title,
				playlist: params.playlist
			},
			logger: {
				clientName: 'mobile-wiki'
			},
			lang: params.lang
		},
		onCreate.bind(this, bidParams)
	);
}
