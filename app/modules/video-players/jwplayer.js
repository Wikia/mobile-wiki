import Ads from '../ads';
import BasePlayer from './base';
import JWPlayerVideoAds from './jwplayer-video-ads';
import {track} from '../../utils/track';
import config from '../../config/environment';

export const jwPlayerAssets = {
	styles: '/mobile-wiki/assets/jwplayer/index.css',
	script: '/mobile-wiki/assets/jwplayer/wikiajwplayer.js'
};

export default class JWPlayer extends BasePlayer {
	constructor(provider, params) {
		const originalOnCreate = params.onCreate;

		super(provider, params);

		params.onCreate = (bidParams, player) => {
			const adsInstance = Ads.getInstance();

			originalOnCreate(player);

			if (adsInstance.jwPlayerAds && adsInstance.jwPlayerMoat) {
				adsInstance.jwPlayerAds(player, bidParams);
				adsInstance.jwPlayerMoat(player);
			}
		};

		this.adTrackingParams = params.adTrackingParams || {};
	}

	setupPlayer() {
		if (!window.wikiaJWPlayer) {
			this.loadPlayer();
		} else {
			this.createPlayer();
		}
	}

	/**
	 * @returns {void}
	 */
	createPlayer() {
		Ads.getInstance()
			.waitForReady()
			.then(() => (new JWPlayerVideoAds(this.params)).getConfig())
			.then(this.initializePlayer.bind(this));
	}

	initializePlayer(bidParams) {
		window.wikiaJWPlayer(
			this.params.containerId,
			{
				tracking: {
					track(data) {
						data.trackingMethod = 'both';

						track(data);
					},
					setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
					comscore: config.environment === 'production'
				},
				settings: {
					showAutoplayToggle: true,
					showCaptions: true
				},
				selectedCaptions: this.params.selectedCaptions,
				autoplay: this.params.autoplay,
				mute: this.params.autoplay,
				related: {
					time: 3,
					playlistId: this.params.recommendedVideoPlaylist || 'Y2RWCKuS',
					autoplay: true
				},
				videoDetails: {
					description: this.params.playlist[0].description,
					title: this.params.playlist[0].title,
					playlist: this.params.playlist
				},
				logger: {
					clientName: 'mobile-wiki'
				}
			},
			this.params.onCreate.bind(this, bidParams)
		);
	}

	/**
	 * @return {void}
	 */
	loadPlayer() {
		this.loadStyles(jwPlayerAssets.styles);
		this.loadScripts(jwPlayerAssets.script, this.playerDidLoad.bind(this));
	}

	loadStyles(cssFile) {
		$(`<link rel="stylesheet" href="${cssFile}" crossorigin="anonymous">`).appendTo('head');
	}

	loadScripts(jsFile, callback) {
		window.M.loadScript(jsFile, true, callback, 'anonymous');
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}

