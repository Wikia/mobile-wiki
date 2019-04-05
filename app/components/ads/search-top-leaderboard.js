import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Ads from '../../modules/ads';

export default Component.extend({
  adSlotBuilder: service('ads/ad-slot-builder'),

  init() {
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);

    this.renderAds();
  },

  willDestroyElement() {
    this._super(...arguments);
  },

  /**
   * @private
   */
  renderAds() {
    Ads.waitForAdEngine().then((ads) => {
      ads.onReady(() => {
        this.adSlotBuilder.injectSearchPageTopLeaderboard(this);
      });
    });
  },
});
