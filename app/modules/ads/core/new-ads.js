import { Promise } from 'rsvp';

class NewAds {
  static getInstance() {
    return NewAds.instance;
  }

  static getLoadedInstance() {
    return new Promise(() => {});
  }

  init() {}

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
