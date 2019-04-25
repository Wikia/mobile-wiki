import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import Ads from '../../modules/ads';

export default Service.extend({
  currentUser: service(),
  fetchService: service('fetch'),
  wikiUrls: service(),
  wikiVariables: service(),

  adsContextPromise: null,

  /**
   * @private
   */
  getAdsContext() {
    if (this.adsContextPromise === null) {
      this.adsContextPromise = Promise.all([this.fetchAdsContextPromise(), Ads.waitForAdEngine()])
        .then(([adsContext]) => {
          adsContext.user = adsContext.user || {};
          adsContext.user.isAuthenticated = this.currentUser.isAuthenticated;

          return adsContext;
        });
    }

    return this.adsContextPromise;
  },

  /**
   * @private
   * @returns {Promise<T | never>}
   */
  fetchAdsContextPromise() {
    const url = this.wikiUrls.build({
      host: this.wikiVariables.host,
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getSearchPageAdsContext',
      },
    });

    return this.fetchService.fetchFromMediawiki(url, {})
      .then(response => response.json()
        .then(data => data.adsContext));
  },
});
