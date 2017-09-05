import Ads from '../ads';
import moatVideoTracker from './moat-video-tracker';

export default class OoyalaVideoAds {

	constructor(params) {
		this.params = params;
	}

	getOoyalaConfig() {
		if (this.params.noAds) {
			return this.params;
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

		return this.params;
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
			.then(() => a9.getSlotParams('FEATURED'));
	}

	isA9VideoEnabled() {
		let ads = Ads.getInstance();
		return ads.a9 &&
			ads.currentAdsContext &&
			ads.currentAdsContext.bidders &&
			ads.currentAdsContext.bidders.a9Video;
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
