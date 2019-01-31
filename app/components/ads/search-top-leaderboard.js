import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Ads from '../../modules/ads';
import AdsMixin from '../../mixins/ads';

export default Component.extend(AdsMixin, {
  ads: service(),

  init() {
    this._super(...arguments);

    this.adsContextPromise = this.ads.fetchSearchAdsContext();
    this.adEnginePromise = Ads.waitForAdEngine();
  },

  didInsertElement() {
    this._super(...arguments);

    this.renderAds();
  },

  willDestroyElement() {
    this._super(...arguments);
  },

  renderAds() {
    Promise.all([this.adEnginePromise, this.adsContextPromise])
      .then(([ads, adsContext]) => {
        adsContext.user = adsContext.user || {};
        adsContext.user.isAuthenticated = this.get('currentUser.isAuthenticated');

        ads.init(adsContext);
        ads.onReady(() => {
          this.setupAdsContext(adsContext);
          this.injectSearchPageAds(this.element);
        });
      });
  },
});
