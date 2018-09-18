import { Promise } from 'rsvp';
import Ads from './module';
import LegacyAds from './legacyModule';

let adsPromise = null;
let isAdEngine3 = false;

export default function getAdsModule() {
  if (adsPromise) {
    return adsPromise;
  }

  adsPromise = new Promise((resolve, reject) => {
    if (typeof window.waitForAds === 'function') {
      window.waitForAds((adEngine3Loaded) => {
        isAdEngine3 = adEngine3Loaded;
        resolve(isAdEngine3 ? Ads.getInstance() : LegacyAds.getInstance());
      });
    } else {
      reject();
    }
  });

  return adsPromise;
}

export function isAdEngine3Loaded() {
  return isAdEngine3;
}
