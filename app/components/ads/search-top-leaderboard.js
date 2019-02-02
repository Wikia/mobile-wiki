import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  adsContextService: service('ads/search-page-ads-context'),
  adSlotBuilder: service('ads/ad-slot-builder'),

  init() {
    this._super(...arguments);

    this.searchAdsPromise = this.adsContextService.waitForSearchAds();
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
