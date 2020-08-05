/* eslint-disable class-methods-use-this */
import OldAds from './core/old-ads';
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
    console.log('**', adsContext);
    if (Ads.isExperimental.isLoaded) {
      return;
    }

    switch (getIsAdEngineExperimental()) {
      case '1':
        console.log('** force new');
        return Ads.isExperimental.resolve(true);
      case '0':
        console.log('** force old');
        return Ads.isExperimental.resolve(false);
      default:
        console.log('** default', !!(adsContext.opts && adsContext.opts.adEngineExperimental));
        return Ads.isExperimental.resolve(!!(adsContext.opts && adsContext.opts.adEngineExperimental))
    }
  }

  /**
   * Returns ads instance.
   * @returns {OldAds | NewAds}
   */
  static getInstance() {
    if (!Ads.isExperimental.isLoaded) {
      console.error('ensureMode should be called before getInstance');
      Ads.ensureMode({});
    }

    if (Ads.isExperimental) {
      return NewAds.getInstance();
    }

    return OldAds.getInstance();
  }

  /**
   * Returns loaded ads instance.
   * @returns {Promise<OldAds | NewAds>}
   */
  static getLoadedInstance() {
    return Ads.isExperimental.finished.then((isExperimental) => {
      if (isExperimental) {
        return NewAds.getLoadedInstance();
      }

      return OldAds.getLoadedInstance();
    });
  }
}

Ads.isExperimental = new PromiseLock();

export default Ads;
