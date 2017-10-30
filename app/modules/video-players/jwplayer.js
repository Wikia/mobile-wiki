import Ads from '../ads';
import BasePlayer from './base';
import {track} from '../../utils/track';

export const jwPlayerAssets = {
	styles: '/mobile-wiki/assets/jwplayer/index.css',
	script: '/mobile-wiki/assets/jwplayer/wikiajwplayer.js'
};

export default class JWPlayer extends BasePlayer {
	constructor(provider, params) {
		const originalOnCreate = params.onCreate;

		super(provider, params);

		params.onCreate = (player) => {
			originalOnCreate(player);

			Ads.getInstance().registerOoyalaTracker(player, this.adTrackingParams);
			// player.mb.subscribe(window.OO.EVENTS.ADS_PLAYED, 'video-tracker', () => {
			// 	this.params.adIndex += 1;
			// });
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
			.then(() => {
				// Ads.getInstance().trackOoyalaEvent(this.adTrackingParams, 'init');
				// return (new JWPlayerVideoAds(this.params, this.adTrackingParams)).getOoyalaConfig();
			})
			.then(this.initializePlayer.bind(this));
	}

	initializePlayer() {
		window.wikiaJWPlayer(this.params.containerId, {
				tracking: {
					track: function (data) {
						data.trackingMethod = 'both';

						track(data);
					},
					setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
					// todo verify after Stanley's response
					comscore: false
				},
				autoplay: {
					enabled: this.params.autoplay,
				},
				related: {
					time: 3,
					playlistId: this.params.recommendedVideoPlaylist || 'Y2RWCKuS',
					autoplay: true
				},
				videoDetails: {
					description: this.params.playlist[0].description,
					title: this.params.playlist[0].title,
					playlist: this.params.playlist
				}
			},
			this.params.onCreate.bind(this)
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
		$script(jsFile, () => {
			callback();
		});
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}

