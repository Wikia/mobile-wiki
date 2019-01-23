import Component from '@ember/component';
import Ads from '../../modules/ads';
import AdsMixin from '../../mixins/ads';

export default Component.extend(AdsMixin, {
  didInsertElement() {
    this._super(...arguments);

    this.renderAds(this.adsContext);
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
