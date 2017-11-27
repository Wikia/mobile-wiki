import {offset} from '../dom-helper';
import Ads from '../ads';
import JWPlayerVideoAds from '../video-players/jwplayer-video-ads';
import {track} from '../../utils/track';

export function initializeMobileWiki() {
	if (!window.mobileWikiInitialized) {
		window.mobileWikiInitialized = true;
		if (typeof FastBoot === 'undefined' && M.getFromShoebox('serverError')) {
			// No need to load Ember in browser on server error page
			return;
		}
		M.loadScript('/mobile-wiki/assets/vendor.js', false, false, 'anonymous');
		M.loadScript('/mobile-wiki/assets/mobile-wiki.js', false, false, 'anonymous');
	}
}

export function setFeaturedVideoPlayer(player) {
	window.featuredVideoPlayer = player;
}

function createCookie(name, value, days = 14) {
	let expires = '';
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = `; expires=${date.toUTCString()}`;
	}
	document.cookie = `${name}=${value}${expires}; path=/; domain=${M.getFromShoebox('runtimeConfig.cookieDomain')}`;
}

function onCreate(bidParams, player) {
	const adsInstance = Ads.getInstance();
	if (adsInstance.jwPlayerAds && adsInstance.jwPlayerMoat) {
		adsInstance.jwPlayerAds(player, bidParams);
		adsInstance.jwPlayerMoat(player);
	}

	player.on('autoplayToggle', ({enabled}) => {
		createCookie('featuredVideoAutoplay', (enabled ? '1' : '0'));
	});

	player.on('captionsSelected', ({selectedLang}) => {
		createCookie('featuredVideoCaptions', selectedLang);
	});

	player.once('adImpression', () => {
		initializeMobileWiki();
	});

	player.once('videoStart', () => {
		initializeMobileWiki();
	});

	player.once('setupError', () => {
		initializeMobileWiki();
	});

	// initialize mobile wiki after 8 seconds if it hasn't been initialized yet
	setTimeout(() => {
		initializeMobileWiki();
	}, 8000);

	setFeaturedVideoPlayer(player);
}

export function updateFeaturedVideoPosition() {
	const articleFeaturedVideoElement = document.querySelector('.article-featured-video');
	if (articleFeaturedVideoElement) {
		const videoOffset = offset(articleFeaturedVideoElement);
		document.querySelector('#pre-featured-video-wrapper').style.top = `${videoOffset.top}px`;
	}
}

export function destroyPlayer() {
	if (window.featuredVideoPlayer) {
		window.featuredVideoPlayer.remove();
		window.featuredVideoPlayer = null;
	}
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
				comscore: M.getFromShoebox('runtimeConfig.wikiaEnv') === 'prod'
			},
			settings: {
				showAutoplayToggle: true,
				showCaptions: true
			},
			selectedCaptionsLanguage: params.selectedCaptionsLanguage,
			autoplay: params.autoplay,
			mute: params.autoplay,
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

export function createPlayer(params) {
	params.onCreate = onCreate;
	Ads.getInstance().waitForReady()
		.then((new JWPlayerVideoAds(params)).getConfig())
		.then(initializePlayer.bind(this, params));
}

export function loadJWPlayerAssets(params) {
	const head = document.getElementsByTagName('head')[0],
		link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = '/mobile-wiki/assets/jwplayer/index.css';
	head.appendChild(link);

	M.loadScript('/mobile-wiki/assets/jwplayer/wikiajwplayer.js', false, () => {
		createPlayer(params);
		updateFeaturedVideoPosition();
	}, 'anonymous');
}

export function getQueryParameterByName(name) {
	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(window.location.href);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
