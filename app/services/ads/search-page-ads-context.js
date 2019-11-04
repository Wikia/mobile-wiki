import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';

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
      this.adsContextPromise = this.fetchAdsContextPromise()
        .then((adsContext) => {
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
    const options = this.fetchService.getOptionsForInternalCache(url);

    return fetch(url, options)
      .then(response => response.json()
        .then(data => data.adsContext));
  },
});
