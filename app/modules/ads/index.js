/* eslint-disable class-methods-use-this */
import StableAds from './core/stable-ads';
import NewAds from './core/new-ads';
import PromiseLock from './core/promise-lock';

function getIsAdEngineExperimental() {
  try {
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get('adengine_experimental');
  } catch (e) {
    return null;
  }
}

class Ads {
  /**
   * @type {PromiseLock}
   */
  static isExperimental;

  static ensureMode(adsContext) {
    if (Ads.isExperimental.isResolved) {
      return;
    }

    switch (getIsAdEngineExperimental()) {
      case '1':
        return Ads.isExperimental.resolve(true);
      case '0':
        return Ads.isExperimental.resolve(false);
      default:
        return Ads.isExperimental.resolve(!!(adsContext.opts && adsContext.opts.adEngineExperimental));
    }
  }

  /**
   * Returns ads instance.
   * @returns {StableAds | NewAds}
   */
  static getInstance() {
    if (!Ads.isExperimental.isResolved) {
      console.error('ensureMode should be called before getInstance');
      Ads.ensureMode({});
    }

    if (Ads.isExperimental) {
      return NewAds.getInstance();
    }

    return StableAds.getInstance();
  }

  /**
   * Returns loaded ads instance.
   * @returns {Promise<StableAds | NewAds>}
   */
  static getLoadedInstance() {
    return Ads.isExperimental.finished.then((isExperimental) => {
      if (isExperimental) {
        return NewAds.getLoadedInstance();
      }

      return StableAds.getLoadedInstance();
    });
  }
}

Ads.isExperimental = new PromiseLock();

export default Ads;
