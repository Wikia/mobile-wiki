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

  waitForVideoBidders() {}

  waitForUapResponse() {}
}

NewAds.instance = new NewAds();

export default NewAds;
