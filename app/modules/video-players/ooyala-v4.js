import Ads from '../ads';
import BasePlayer from './base';
import config from '../../config/environment';
import loadOoyalaGoogleImaPlugin from './google_ima';

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

		params.pcode = ooyalaPCode;
		params.playerBrandingId = ooyalaPlayerBrandingId;
		params.skin = {
			config: skinConfigUrl
		};

		super(provider, params);

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
			loadOoyalaGoogleImaPlugin();

			Ads.getInstance().onReady(() => {
				if (!this.params.noAds) {
					const vastUrl = Ads.getInstance().buildVastUrl(640 / 480, {
						pos: 'FEATURED_VIDEO',
						src: 'premium'
					});

					this.params['google-ima-ads-manager'] = {
						all_ads: [
							{
								tag_url: vastUrl
							}
						],
						useGoogleCountdown: true
					};
				}

				window.OO.Player.create(this.containerId, this.params.videoId, this.params);
			});
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
