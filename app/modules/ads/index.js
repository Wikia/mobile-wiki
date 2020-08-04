/* eslint-disable class-methods-use-this */
import OldAds from './core/old-ads';
import NewAds from './core/new-ads';
import PromiseLock from './core/promise-lock';

function isAdEngineExperimental() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('adengine_experimental');

    return param === '1';
  } catch (e) {
    return false;
  }
}

class Ads {
  /**
   * @private
   * @type {PromiseLock}
   */
  static isExperimental;

  static ensureMode(adsContext) {
    if (Ads.isExperimental.isLoaded) {
      return;
    }

    if (isAdEngineExperimental() || adsContext.adEngineExperimental) {
      Ads.isExperimental.resolve(true);
      return;
    }

    Ads.isExperimental.resolve(false);
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

  static beforeTransition() {
    if (!Ads.isExperimental.isLoaded) {
      return;
    }

    Ads.getInstance()
      .beforeTransition();
  }

  static onTransition(options) {
    if (!Ads.isExperimental.isLoaded) {
      return;
    }

    Ads.getInstance()
      .onTransition(options);
  }

  static afterTransition(mediaWikiAdsContext) {
    if (!Ads.isExperimental.isLoaded) {
      return;
    }

    Ads.getInstance()
      .afterTransition(mediaWikiAdsContext);
  }
}

Ads.isExperimental = new PromiseLock();

export default Ads;
