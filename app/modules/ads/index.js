import {Promise} from 'rsvp';
import Ads from './module';
import LegacyAds from './legacyModule';

let adsPromise = null;
let isAdEngine3 = false;

export default function getAdsModule() {
	if (adsPromise) {
		return adsPromise;
	}

	adsPromise = new Promise((resolve) => {
		if (typeof window.waitForAds === 'function') {
			window.waitForAds((isAdEngine3Loaded) => {
				isAdEngine3 = isAdEngine3Loaded;
				resolve(isAdEngine3Loaded ? Ads.getInstance() : LegacyAds.getInstance());
			});
		}
	});

	return adsPromise;
}

export function isAdEngine3Loaded() {
	return isAdEngine3;
}
