import Ads from '../ads';
import BasePlayer from './base';
import OoyalaVideoAds from './ooyala-video-ads';
import config from '../../config/environment';

export const ooyalaAssets = {
	styles: [
		'/mobile-wiki/assets/ooyala/html5-skin.css',
		'/mobile-wiki/assets/ooyala.css'
	],
	script: '/mobile-wiki/assets/ooyala/all.js'
};

export default class OoyalaV4Player extends BasePlayer {
	/**
	 * @param {string} provider
	 * @param {*} params
	 * @returns {void}
	 */
	constructor(provider, params) {
		const ooyalaPCode = config.ooyala.pcode;
		const ooyalaPlayerBrandingId = config.ooyala.playerBrandingId;
		const skinConfigUrl = `/wikia.php?controller=OoyalaConfig&method=skin&isMobile=1&cb=${params.cacheBuster}`;
		const originalOnCreate = params.onCreate;

		params.pcode = ooyalaPCode;
		params.playerBrandingId = ooyalaPlayerBrandingId;
		if (!params.skin) {
			params.skin = {};
		}
		params.skin.config = skinConfigUrl;

		super(provider, params);
		this.adTrackingParams = params.adTrackingParams || {};

		params.onCreate = (player) => {
			originalOnCreate(player);

			Ads.getInstance().registerOoyalaTracker(player, this.adTrackingParams);
			player.mb.subscribe(window.OO.EVENTS.ADS_PLAYED, 'video-tracker', () => {
				this.params.adIndex += 1;
			});
		};

		this.containerId = params.containerId;
	}

	/**
	 * @returns {void}
	 */
	setupPlayer() {
		if (!window.OO) {
			this.loadPlayer();
		} else {
			this.createPlayer();
		}
	}

	/**
	 * @returns {void}
	 */
	createPlayer() {
		window.OO.ready(() => {
			Ads.getInstance()
				.waitForReady()
				.then(() => {
					Ads.getInstance().trackOoyalaEvent(this.adTrackingParams, 'init');
					return (new OoyalaVideoAds(this.params, this.adTrackingParams)).getOoyalaConfig();
				})
				.then((params) => window.OO.Player.create(this.containerId, this.params.videoId, params));
		});
	}

	/**
	 * @return {void}
	 */
	loadPlayer() {
		this.loadStyles(ooyalaAssets.styles);
		this.loadScripts(ooyalaAssets.script, this.playerDidLoad.bind(this));
	}

	loadStyles(cssFiles) {
		const html = cssFiles.map((url) => {
			return `<link rel="stylesheet" href="${url}" crossorigin="anonymous">`;
		}).join('');

		$(html).appendTo('head');
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
