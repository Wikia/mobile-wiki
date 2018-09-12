import { Promise } from 'rsvp';
import getAdsModule from '../ads';

export default class JWPlayerVideoAds {
  constructor(params) {
    this.params = params;
  }

  getConfig() {
    if (this.params.noAds) {
      return Promise.resolve(this.params);
    }

    return getAdsModule()
      .then(adsModule => adsModule.waitForVideoBidders());
  }
}
