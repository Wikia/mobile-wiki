import Component from '@ember/component';
import { getOwner } from '@ember/application';
import Ads from '../../modules/ads';
import AdsMixin from '../../mixins/ads';
import SerachAdsContextModel from '../../models/ads/search-ads-context';

export default Component.extend(AdsMixin, {
  init() {
    this._super(...arguments);

    this.adsContextModel = SerachAdsContextModel.create(getOwner(this).ownerInjection());
    this.adsContextPromise = this.adsContextModel.fetch();
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
