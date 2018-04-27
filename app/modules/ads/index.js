import {Promise} from 'rsvp';
import Ads from './module';
import LegacyAds from './legacyModule';

export default function getAdsModule() {
	return new Promise((resolve, reject) => {
		if (typeof window.waitForAds !== 'function') {
			reject(new Error('Inline ads script is not loaded'));
		}

		window.waitForAds((isAdEngine3Loaded) => {
			resolve(isAdEngine3Loaded ? Ads.getInstance() : LegacyAds.getInstance());
		});
	});
}

export function isAdEngine3Module(adsModule) {
	return adsModule instanceof Ads;
}
