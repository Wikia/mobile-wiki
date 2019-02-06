import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';
import Ads from '../../modules/ads';

export default Service.extend({
  currentUser: service(),
  fetchService: service('fetch'),
  wikiUrls: service(),
  wikiVariables: service(),

  /**
   * @private
   */
  getAdsContext() {
    return Promise.all([this.fetchAdsContextPromise(), Ads.waitForAdEngine()])
      .then(([adsContext]) => {
        adsContext.user = adsContext.user || {};
        adsContext.user.isAuthenticated = this.currentUser.isAuthenticated;

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
