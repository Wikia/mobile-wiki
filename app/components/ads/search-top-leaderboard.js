import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  ads: service('ads/ads'),
  adSlotBuilder: service('ads/ad-slot-builder'),

  init() {
    this._super(...arguments);

    this.searchAdsPromise = this.ads.waitForSearchAds();
  },

  didInsertElement() {
    this._super(...arguments);

    this.renderAds();
  },

  willDestroyElement() {
    this._super(...arguments);
  },

  renderAds() {
    this.searchAdsPromise
      .then((adsContext) => {
        this.adSlotBuilder.setupAdsContext(adsContext);
        this.adSlotBuilder.injectSearchPageTopLeaderboard(this);
      });
  },
});
