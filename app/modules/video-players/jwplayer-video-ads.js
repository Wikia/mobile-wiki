import { Promise } from 'rsvp';
import getAdsModule from '../ads';

export default class JWPlayerVideoAds {
	constructor(params) {
		this.params = params;
	}

	getConfig() {
		if (this.params.noAds) {
			return Promise.resolve(this.params);
		}

		return JWPlayerVideoAds.isA9VideoEnabled().then((isA9VideoEnabled) => {
			if (isA9VideoEnabled) {
				return new Promise((resolve) => {
					JWPlayerVideoAds.parseBidderParameters(resolve, (params, error) => {
						/* eslint no-console: 0 */
						console.error('JWPlayer: Error while receiving bidder parameters:', error);
						resolve(params);
					});
				});
			} else {
				return Promise.resolve({});
			}
		});
	}

	static parseBidderParameters(onSuccess, onError) {
		getAdsModule().then((adsModule) => {
			const a9 = adsModule.a9;
			const responseTimeout = 2000;

			if (!a9) {
				onError({}, 'A9 bidder not found');
			}

			a9.waitForResponseCallbacks(
				() => onSuccess(a9.getSlotParams('FEATURED')),
				() => onError({}, 'Connection timed out'),
				responseTimeout,
			);
		});
	}

	static isA9VideoEnabled() {
		return getAdsModule().then(ads => ads.a9
			&& ads.currentAdsContext
			&& ads.currentAdsContext.bidders
			&& ads.currentAdsContext.bidders.a9Video);
	}
}
