import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { getQueryString } from '@wikia/ember-fandom/utils/url';
import { equal } from '@ember/object/computed';

export default EmberObject.extend({
  batch: 0,
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
  tracing: service(),
  scope: 'internal',
  isInteralScope: equal('scope', 'internal'),

  canLoadMore: computed('batch', 'totalBatches', function () {
    return this.batch + 1 < this.totalBatches;
  }),

  init() {
    this._super(...arguments);
    this.set('items', A([]));
  },

  search(query) {
    this.setProperties({
      batch: 0,
      totalItems: 0,
      totalBatches: 0,
      query,
      items: A([]),
    });

    if (query) {
      return this.fetchResults(query);
    }

    return this;
  },

  loadMore() {
    if (this.canLoadMore) {
      this.set('batch', this.batch + 1);

      return this.fetchResults(this.query);
    }

    return false;
  },

  fetchResults(query) {
    this.setProperties({
      error: '',
      loading: true,
    });

    const queryParams = {
      query,
      page: this.batch,
      lang: this.wikiVariables.language.content,
      namespace: 0,
      limit: 25,
    };

    if (this.get('scope') === 'internal') {
      queryParams.wikiId = this.wikiVariables.id;
    }

    const queryString = getQueryString(queryParams);

    return this.fetchService.fetchFromUnifiedSearch(`/page-search${queryString}`)
      .then(data => this.update(data))
      .catch((e) => {
        this.setProperties({
          error: 'search-error-general',
          erroneousQuery: query,
          loading: false,
        });

        this.logger.error('Search request error', e);

        return this;
      });
  },

  update(state) {
    const currentSize = this.items ? this.items.length : 0;

    this.setProperties({
      items: this.items.concat(state.results.map((item, index) => ({
        id: item.pageId,
        position: currentSize + index,
        title: item.title,
        snippet: htmlSafe(item.content),
        prefixedTitle: this.wikiUrls.getEncodedTitleFromURL(item.url),
        url: item.url,
        wikiId: item.wikiId,
      }))),
      loading: false,
      totalItems: state.totalResultsFound,
      totalBatches: state.paging.total,
    });

    return this;
  },

  changeScope(newScope) {
    this.set('scope', newScope);

    this.search(this.query);
  },
});
