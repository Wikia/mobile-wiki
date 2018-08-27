import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import fetch from '../utils/mediawiki-fetch';

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

    if (query) {
      return this.fetch(query);
    }

    return this;
  },

  loadMore() {
    if (this.canLoadMore) {
      this.set('batch', this.batch + 1);

      return this.fetch(this.query);
    }

    return false;
  },

  fetch(query) {
    this.setProperties({
      error: '',
      loading: true,
    });

    return fetch(this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      path: '/wikia.php',
      query: {
        controller: 'SearchApi',
        method: 'getList',
        query,
        batch: this.batch,
      },
    }))
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
        } else {
          // update state on success
          return response.json().then(data => this.update(data));
        }
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
