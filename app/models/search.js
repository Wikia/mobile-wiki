import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import fetch from 'fetch';

export default EmberObject.extend({
  batch: 1,
  error: '',
  erroneousQuery: '',
  items: null,
  loading: false,
  query: '',
  totalItems: 0,
  totalBatches: 0,
  wikiVariables: service(),
  logger: service(),
  wikiUrls: service(),
  fetchService: service('fetch'),

  canLoadMore: computed('batch', 'totalBatches', function () {
    return this.batch < this.totalBatches;
  }),

  init() {
    this._super(...arguments);
    this.set('items', A([]));
  },

  search(query) {
    this.setProperties({
      batch: 1,
      totalItems: 0,
      totalBatches: 0,
      query,
      items: A([]),
    });

    const fetchAdsContextPromise = this.fetchAdsContext();

    if (query) {
      const fetchResultsPromise = this.fetchResults(query);
      // return fetchResultsPromise;
      return Promise.all([fetchResultsPromise, fetchAdsContextPromise])
        .then(() => this);
    }

    return fetchAdsContextPromise;
  },

  fetchAdsContext() {
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
        .then((data) => {
          this.setProperties({
            adsContext: data.adsContext,
          });

          return this;
        }));
  },

  loadMore() {
    if (this.canLoadMore) {
      this.set('batch', this.batch + 1);

      return this.fetchResults(this.query);
    }

    return false;
  },

  fetchResults(query) {
    const url = this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'SearchApi',
        method: 'getList',
        query,
        batch: this.batch,
      },
    });
    const options = this.fetchService.getOptionsForInternalCache(url);

    this.setProperties({
      error: '',
      loading: true,
    });

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          this.setProperties({
            error: 'search-error-general',
            erroneousQuery: query,
            loading: false,
          });

          if (response.status === 404) {
            this.set('error', 'search-error-not-found');
          } else {
            this.logger.error('Search request error', response);
          }

          return this;
        }
        // update state on success
        return response.json().then(data => this.update(data));
      });
  },

  update(state) {
    this.setProperties({
      items: this.items.concat(state.items.map(item => (
        {
          title: item.title,
          snippet: htmlSafe(item.snippet),
          prefixedTitle: this.wikiUrls.getEncodedTitleFromURL(item.url),
        }
      ))),
      loading: false,
      totalItems: state.total,
      totalBatches: state.batches,
    });

    return this;
  },
});
