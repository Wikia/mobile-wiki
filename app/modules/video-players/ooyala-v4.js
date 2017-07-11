import Ads from '../ads';
import BasePlayer from './base';
import moatVideoTracker from './moat-video-tracker';
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

		params.pcode = ooyalaPCode;
		params.playerBrandingId = ooyalaPlayerBrandingId;
		if (!params.skin) {
			params.skin = {};
		}
		params.skin.config = skinConfigUrl;

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
						useGoogleAdUI: true,
						useGoogleCountdown: false,
						onBeforeAdsManagerStart(IMAAdsManager) {
							// mutes VAST ads from the very beginning
							// FIXME with VPAID it causes volume controls to be in incorrect state
							IMAAdsManager.setVolume(0);
						},
						onAdRequestSuccess: this.onAdRequestSuccess.bind(this)
					};
					this.params.replayAds = false;
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

	onAdRequestSuccess(IMAAdsManager, uiContainer) {
		if (Ads.getInstance().currentAdsContext.opts.isMoatTrackingForFeaturedVideoEnabled) {
			moatVideoTracker(IMAAdsManager, uiContainer, google.ima.ViewMode.NORMAL, 'ooyala', 'featured-video');
		}

		IMAAdsManager.addEventListener('loaded', (eventData) => {
			if (eventData.getAdData().vpaid === true) {
				window.pp.mb.publish(window.OO.EVENTS.WIKIA.SHOW_AD_TIME_LEFT, false);
				window.pp.mb.publish(window.OO.EVENTS.WIKIA.SHOW_AD_FULLSCREEN_TOGGLE, false);
			}
		}, false, this);

		// that's a hack for autoplay on mobile for VPAID ads
		// VPAID ads still don't work perfectly
		let initiallyResumed = false;
		IMAAdsManager.addEventListener('pause', (eventData) => {
			if (eventData.getAd().getApiFramework() === 'VPAID') {
				if (!initiallyResumed) {
					IMAAdsManager.resume();
					// we don't use removeEventListener because it doesn't work as expected
					initiallyResumed = true;
				}
			}
		}, false, this);
	}
}
