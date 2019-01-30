import Component from '@ember/component';
import { inject as service } from '@ember/service';
import AdsMixin from '../../mixins/ads';

export default Component.extend(AdsMixin, {
  ads: service(),

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
        this.setupAdsContext(adsContext);
        this.injectSearchPageNative(this.element);
      });
  },
});
