import Ads from '../ads';

export default class JWPlayerVideoAds {
	constructor(params) {
		this.params = params;
	}

	getConfig() {
		if (this.params.noAds) {
			return this.params;
		} else if (this.isA9VideoEnabled()) {
			return this.parseBidderParameters()
				.catch(() => {});
		} else {
			return {};
		}
	}

	parseBidderParameters() {
		const a9 = Ads.getInstance().a9;

		if (!a9) {
			return {};
		}

		return a9.waitForResponse()
			.then(() => a9.getSlotParams('FEATURED'));
	}

	isA9VideoEnabled() {
		const ads = Ads.getInstance();

		return ads.a9 &&
			ads.currentAdsContext &&
			ads.currentAdsContext.bidders &&
			ads.currentAdsContext.bidders.a9Video;
	}
}
