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
        return Ads.adsMode.resolve('experimental');
      case '0':
        return Ads.adsMode.resolve('stable');
      default:
        return Ads.adsMode.resolve(!!(adsContext.opts && adsContext.opts.adEngineExperimental) ? 'experimental' : 'stable');
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

    if (Ads.adsMode.value === 'experimental') {
      return ExperimentalAds.getInstance();
    }

    return StableAds.getInstance();
  }

  /**
   * Returns loaded ads instance.
   * @returns {Promise<StableAds | ExperimentalAds>}
   */
  static getLoadedInstance() {
    return Ads.adsMode.promise.then((isExperimental) => {
      if (isExperimental) {
        return ExperimentalAds.getLoadedInstance();
      }

      return StableAds.getLoadedInstance();
    });
  }
}

Ads.adsMode = new PromiseLock();

export default Ads;
