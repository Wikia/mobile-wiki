import { Promise } from 'rsvp';
import Ads from './module';

let adsPromise = null;

export default function waitForAdEngine() {
  if (adsPromise) {
    return adsPromise;
  }

  adsPromise = new Promise((resolve, reject) => {
    if (typeof window.waitForAds === 'function') {
      window.waitForAds(() => {
        resolve(Ads.getInstance());
      });
    } else {
      reject();
    }
  });

  return adsPromise;
}
