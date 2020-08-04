import { Promise } from 'rsvp';

class NewAds {
  static getInstance() {
    return NewAds.instance;
  }

  static getLoadedInstance() {
    return Promise.reject(new Error('NewAds bundle'));
  }

  init() {
    // TODO: load new bundle
  }

  getAdSlotComponentAttributes() {}

  pushSlotToQueue() {}

  registerActions() {}

  /**
   * initialized
   */
  beforeTransition() {}

  /**
   * initialized
   */
  onTransition() {}

  /**
   * initialized
   */
  afterTransition() {}

  onMenuOpen() {}

  waitForVideoBidders() {
    return Promise.reject(new Error('NewAds bundle'));
  }

  waitForUapResponse() {
    return Promise.reject(new Error('NewAds bundle'));
  }
}

NewAds.instance = new NewAds();

export default NewAds;
