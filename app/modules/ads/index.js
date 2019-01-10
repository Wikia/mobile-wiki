import { Promise } from 'rsvp';

let adsPromise = null;

export default function waitForAdEngine() {
  if (adsPromise) {
    return adsPromise;
  }

  adsPromise = new Promise((resolve, reject) => {
    if (typeof window.waitForAds === 'function') {
      window.waitForAds(resolve);
    } else {
      reject();
    }
  });

  return adsPromise;
}
