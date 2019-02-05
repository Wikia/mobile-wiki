import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';
import Ads from '../../modules/ads';

export default Service.extend({
  wikiVariables: service(),
  currentUser: service(),
  wikiUrls: service(),
  fetchService: service('fetch'),
  adsContextPromise: null,

  init() {
    this._super(...arguments);

    this.setAdsContextPromise();
  },

  /**
   * @returns {Promise}
   */
  getAdsContextPromise() {
    return this.adsContextPromise;
  },

  /**
   * @private
   */
  setAdsContextPromise() {
    this.adsContextPromise = Promise.all([Ads.waitForAdEngine(), this.fetchAdsContextPromise()])
      .then(([ads, adsContext]) => {
        adsContext.user = adsContext.user || {};
        adsContext.user.isAuthenticated = this.currentUser.isAuthenticated;
        ads.init(adsContext);

        return adsContext;
      });
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
    const options = this.fetchService.getOptionsForInternalCache(url);

    return fetch(url, options)
      .then(response => response.json()
        .then(data => data.adsContext));
  },
});
