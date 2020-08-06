/* eslint-disable class-methods-use-this */
import StableAds from './core/stable-ads';
import ExperimentalAds from './core/experimental-ads';
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
  static adsMode;

  static ensureMode(adsContext) {
    if (Ads.adsMode.isResolved) {
      return;
    }

    switch (getIsAdEngineExperimental()) {
      case '1':
        return Ads.adsMode.resolve(ExperimentalAds);
      case '0':
        return Ads.adsMode.resolve(StableAds);
      default:
        return Ads.adsMode.resolve(!!(adsContext.opts && adsContext.opts.adEngineExperimental) ? ExperimentalAds : StableAds);
    }
  }

  /**
   * Returns ads instance.
   * @returns {StableAds | ExperimentalAds}
   */
  static getInstance() {
    if (!Ads.adsMode.isResolved) {
      console.error('ensureMode should be called before getInstance');
      Ads.ensureMode({});
    }

    return Ads.adsMode.value.getInstance();
  }

  /**
   * Returns loaded ads instance.
   * @returns {Promise<StableAds | ExperimentalAds>}
   */
  static getLoadedInstance() {
    return Ads.adsMode.promise.then((AdsMode) => AdsMode.getLoadedInstance());
  }
}

Ads.adsMode = new PromiseLock();

export default Ads;
