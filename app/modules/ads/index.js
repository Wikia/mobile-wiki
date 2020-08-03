/* eslint-disable class-methods-use-this */
import OldAds from './core/old-ads';

class Ads {
  /**
   * Returns ads instance.
   * @returns {OldAds}
   */
  static getInstance() {
    return OldAds.getInstance();
  }

  /**
   * Returns loaded ads instance.
   * @returns {Promise<OldAds>}
   */
  static getLoadedInstance() {
    return OldAds.getInstance().initialization.finished;
  }
}

export default Ads;
