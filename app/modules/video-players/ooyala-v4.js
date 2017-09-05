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
			Ads.getInstance()
				.waitForReady()
				.then(() => this.setupAds())
				.then(() => window.OO.Player.create(this.containerId, this.params.videoId, this.params));
		});
	}

	setupAds() {
		if (this.params.noAds) {
			return null;
		} else if (this.isA9VideoEnabled()) {
			return this.parseBidderParameters()
				.catch(() => {})
				.then((additionalParams) => this.setupAdManager(additionalParams));
		} else {
			return this.setupAdManager();
		}
	}

	setupAdManager(additionalParams) {
		additionalParams = additionalParams || {};
		this.params['google-ima-ads-manager'] = this.getAdsManagerConfig(this.buildVAST(additionalParams));
		this.params.replayAds = false;
	}

	buildVAST(slotParams) {
		slotParams = slotParams || {};
		slotParams.pos = 'FEATURED';
		slotParams.src = 'premium';

		return Ads.getInstance().buildVastUrl(640 / 480, slotParams, {
			contentSourceId: this.params.dfpContentSourceId,
			videoId: this.params.videoId
		});
	}

	parseBidderParameters() {
		let a9 = Ads.getInstance().a9;

		if (!a9 || !this.isA9VideoEnabled()) {
			return {};
		}

		return a9.waitForResponse()
			.then(() => a9.getSlotParams('FEATURED'))
	}

	isA9VideoEnabled() {
		let ads = Ads.getInstance();
		return Ads.getInstance().a9 && ads.currentAdsContext && ads.currentAdsContext.bidders && ads.currentAdsContext.bidders.a9Video;
	}

	getAdsManagerConfig(vastUrl) {
		return {
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
			moatVideoTracker(IMAAdsManager, uiContainer, window.google.ima.ViewMode.NORMAL, 'ooyala', 'featured-video');
		}

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
