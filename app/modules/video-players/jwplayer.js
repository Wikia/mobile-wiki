import Ads from '../ads';
import BasePlayer from './base';
import JWPlayerVideoAds from './jwplayer-video-ads';
import {track} from '../../utils/track';
import config from '../../config/environment';
import JWPlayerAssets from '../jwplayer-assets';

export default class JWPlayer extends BasePlayer {
	constructor(provider, params) {
		const originalOnCreate = params.onCreate;

		super(provider, params);
		this.recommendedVideoPlaylist = params.recommendedVideoPlaylist || 'Y2RWCKuS';
		this.videoTags = params.videoTags || '';

		params.onCreate = (bidParams, player) => {
			const adsInstance = Ads.getInstance();
			const slotTargeting = {
				plist: this.recommendedVideoPlaylist,
				vtags: this.videoTags
			};

			originalOnCreate(player);

			if (adsInstance.jwPlayerAds && adsInstance.jwPlayerMoat) {
				adsInstance.jwPlayerAds(player, bidParams, slotTargeting);
				adsInstance.jwPlayerMoat.track(player);
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
		if (!document.getElementById(containerId)) {
			return;
		}

		window.wikiaJWPlayer(
			containerId,
			{
				tracking: {
					track(data) {
						data.trackingMethod = 'both';

						/**
						 * this function is called by a third party lib (jwplayer) asynchrounosly
						 * if video player is not in DOM - probably user navigated to another page
						 * do not call tracking function in such case
						 */
						if (document.getElementById(containerId)) {
							track(data);
						}
					},
					setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
					comscore: config.environment === 'production'
				},
				settings: {
					showAutoplayToggle: true,
					showCaptions: true
				},
				sharing: true,
				selectedCaptionsLanguage: this.params.selectedCaptionsLanguage,
				autoplay: this.params.autoplay,
				mute: this.params.autoplay,
				related: {
					time: 3,
					playlistId: this.recommendedVideoPlaylist,
					autoplay: true
				},
				videoDetails: {
					description: this.params.playlist[0].description,
					title: this.params.playlist[0].title,
					playlist: this.params.playlist
				},
				logger: {
					clientName: 'mobile-wiki',
					clientVersion: config.APP.version
				},
				lang: this.params.lang
			},
			this.params.onCreate.bind(this, bidParams)
		);

		Ads.getInstance().jwPlayerMoat.loadTrackingPlugin();
	}

	/**
	 * @return {void}
	 */
	loadPlayer() {
		JWPlayerAssets.load().then(() => {
			this.playerDidLoad();
		});
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}
