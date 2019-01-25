import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import fetch from 'fetch';

export default EmberObject.extend({
  wikiVariables: service(),
  wikiUrls: service(),
  fetchService: service('fetch'),

  init() {
    this._super(...arguments);
  },

  fetch() {
    const url = this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
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
