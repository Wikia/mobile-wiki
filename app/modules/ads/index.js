/* eslint-disable class-methods-use-this */
import OldAds from './core/old-ads';
import NewAds from './core/new-ads';

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
   * @type {boolean}
   */
  static isExperimental;

  static ensureMode(adsContext = {}) {
    if (typeof Ads.isExperimental === 'boolean') {
      return;
    }

    if (isAdEngineExperimental() || adsContext.adEngineExperimental) {
      Ads.isExperimental = true;
      return;
    }

    Ads.isExperimental = false;
  }

  /**
   * Returns ads instance.
   * @returns {OldAds | NewAds}
   */
  static getInstance() {
    const isSet = typeof Ads.isExperimental === 'boolean';
    if (isSet) {
      console.log('** getInstance', isSet);
    } else {
      console.trace('** getInstance', isSet);
    }

    Ads.ensureMode();

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
    const isSet = typeof Ads.isExperimental === 'boolean';
    if (isSet) {
      console.log('** getLoadedInstance', isSet);
    } else {
      console.trace('** getLoadedInstance', isSet);
    }

    Ads.ensureMode();

    if (Ads.isExperimental) {
      return NewAds.getLoadedInstance();
    }

    return OldAds.getLoadedInstance();
  }
}

export default Ads;
