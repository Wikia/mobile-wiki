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

    Ads.getLoadedInstance()
      .then(() => {
        this.renderAds();
      })
      .catch(() => {}); // Ads not loaded
  },

  willDestroyElement() {
    this._super(...arguments);
  },

  /**
   * @private
   */
  renderAds() {
    this.adSlotBuilder.injectSearchPageTopLeaderboard(this);
  },
});
