import Component from '@ember/component';
import { getOwner } from '@ember/application';
import Ads from '../../modules/ads';
import AdsMixin from '../../mixins/ads';
import AdsContextModel from '../../models/ads/ads-context';

export default Component.extend(AdsMixin, {
  init() {
    this._super(...arguments);

    this.adsContextModel = AdsContextModel.create(getOwner(this).ownerInjection());
    this.adsContextPromise = this.adsContextModel.fetch();
  },

  didInsertElement() {
    this._super(...arguments);

    this.adsContextPromise.then(adsContext => this.renderAds(adsContext));
  },

  willDestroyElement() {
    this._super(...arguments);
  },

  renderAds(adsContext) {
    Ads.waitForAdEngine()
      .then((ads) => {
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
