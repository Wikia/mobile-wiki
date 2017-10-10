import Ads from '../ads';
import moatVideoTracker from './moat-video-tracker';

export default class OoyalaVideoAds {

	constructor(params, trackingParams) {
		this.params = params;
		this.trackingParams = trackingParams;
	}

	getOoyalaConfig() {
		if (this.params.noAds) {
			return this.params;
		} else if (this.isA9VideoEnabled()) {
			return this.parseBidderParameters()
				.catch(() => {})
				.then((bidParams) => this.setupAdManager(bidParams));
		} else {
			return this.setupAdManager();
		}
	}

	setupAdManager(bidParams = {}) {
		this.params['google-ima-ads-manager'] = this.getAdsManagerConfig(bidParams);
		this.params.replayAds = false;

		return this.params;
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

	getAdsManagerConfig(bidParams = {}) {
		return {
			all_ads: Ads.getInstance().ooyalaAdSetProvider.get(1, null, {
				contentSourceId: this.params.dfpContentSourceId,
				videoId: this.params.videoId
			}, bidParams),
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

		IMAAdsManager.addEventListener('loaded', (eventData) => {
			const adData = eventData.getAdData(),
				currentAd = IMAAdsManager.getCurrentAd(),
				adSet = this.params['google-ima-ads-manager'].all_ads;

			let wrapperCreativeId,
				wrapperId;

			if (adData) {
				this.trackingParams.lineItemId = adData.adId;
				this.trackingParams.creativeId = adData.creativeId;
			}

			if (currentAd) {
				wrapperId = currentAd.getWrapperAdIds();
				if (wrapperId.length) {
					this.trackingParams.lineItemId = wrapperId[0];
				}

				wrapperCreativeId = currentAd.getWrapperCreativeIds();
				if (wrapperCreativeId.length) {
					this.trackingParams.creativeId = wrapperCreativeId[0];
				}
			}

			if (adSet && adSet[this.params.adIndex]) {
				Ads.getInstance().dispatchEvent('video.status', {
					vastUrl: adSet[this.params.adIndex].tag_url,
					creativeId: this.trackingParams.creativeId,
					lineItemId: this.trackingParams.lineItemId,
					status: 'success'
				});
			}
		});

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
