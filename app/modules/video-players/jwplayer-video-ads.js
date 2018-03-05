import Ads from '../ads';
import {Promise} from 'rsvp';

export default class JWPlayerVideoAds {
	constructor(params) {
		this.params = params;
	}

	getConfig() {
		if (this.params.noAds) {
			return Promise.resolve(this.params);
		} else if (this.isA9VideoEnabled()) {
			return new Promise((resolve) => {
				this.parseBidderParameters(resolve, (params, error) => {
					/* eslint no-console: 0 */
					console.error('JWPlayer: Error while receiving bidder parameters:', error);
					resolve(params);
				});
			});
		} else {
			return Promise.resolve({});
		}
	}

	parseBidderParameters(onSuccess, onError) {
		const a9 = Ads.getInstance().a9;
		const responseTimeout = 2000;

		if (!a9) {
			onError({}, 'A9 bidder not found');
		}

		const result = a9.waitForResponse(
			() => onSuccess(a9.getSlotParams('FEATURED')),
			() => onError({}, 'Connection timed out'),
			responseTimeout
		);

		// TODO ADEN-6812: remove when new implementation of waitForResponse() will be deployed
		if (typeof result === 'object') {
			result.then(() => a9.getSlotParams('FEATURED'))
				.catch((error) => onError({}, error));
		}
	}

	isA9VideoEnabled() {
		const ads = Ads.getInstance();

		return ads.a9 &&
			ads.currentAdsContext &&
			ads.currentAdsContext.bidders &&
			ads.currentAdsContext.bidders.a9Video;
	}
}
