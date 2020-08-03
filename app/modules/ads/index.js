/* eslint-disable class-methods-use-this */
import OldAds from './core/old-ads';
import isAdEngineExperimental from '../is-ad-engine-experimental';
import NewAds from './core/new-ads';

class Ads {
  /**
   * Returns ads instance.
   * @returns {OldAds | NewAds}
   */
  static getInstance() {
    if (isAdEngineExperimental()) {
      return NewAds.getInstance();
    }

    return OldAds.getInstance();
  }

  /**
   * Returns loaded ads instance.
   * @returns {Promise<OldAds | NewAds>}
   */
  static getLoadedInstance() {
    if (isAdEngineExperimental()) {
      return NewAds.getLoadedInstance();
    }

    return OldAds.getLoadedInstance();
  }
}

export default Ads;
