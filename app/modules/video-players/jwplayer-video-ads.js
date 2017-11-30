import Ads from '../ads';

export default class JWPlayerVideoAds {
	constructor(params) {
		this.params = params;
	}

	getConfig() {
		if (this.params.noAds) {
			return Promise.resolve(this.params);
		} else if (this.isA9VideoEnabled()) {
			return this.parseBidderParameters()
				/* eslint no-console: 0 */
				.catch((error) => console.error('JWPlayer: Error while receiving bidder parameters', error));
		} else {
			return Promise.resolve({});
		}
	}

	parseBidderParameters() {
		const a9 = Ads.getInstance().a9;

		if (!a9) {
			return Promise.resolve({});
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
