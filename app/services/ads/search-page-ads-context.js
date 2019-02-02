import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import Ads from '../../modules/ads';

export default Service.extend({
  wikiVariables: service(),
  currentUser: service(),
  wikiUrls: service(),
  fetchService: service('fetch'),
  searchAdsPromise: null,

  init() {
    this._super(...arguments);
  },

  waitForSearchAds() {
    if (this.searchAdsPromise) {
      return this.searchAdsPromise;
    }

    const adsContextPromise = this.fetchSearchAdsContext();
    const adEnginePromise = Ads.waitForAdEngine();

    this.searchAdsPromise = new Promise((resolve) => {
      Promise.all([adEnginePromise, adsContextPromise])
        .then(([ads, adsContext]) => {
          adsContext.user = adsContext.user || {};
          adsContext.user.isAuthenticated = this.currentUser.isAuthenticated;

          ads.init(adsContext);
          ads.onReady(() => {
            resolve(adsContext);
          });
        });
    });

    return this.searchAdsPromise;
  },

  /**
   * @private
   * @returns {Promise<T | never>}
   */
  fetchSearchAdsContext() {
    const url = this.wikiUrls.build({
      host: this.wikiVariables.host,
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getSearchPageAdsContext',
      },
    });
    const options = this.fetchService.getOptionsForInternalCache(url);

    return fetch(url, options)
      .then(response => response.json()
        .then(data => data.adsContext));
  },
});
