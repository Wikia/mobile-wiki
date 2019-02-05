import { inject as service } from '@ember/service';
import { equal, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { track, trackActions } from '../utils/track';

export default Controller.extend({
  application: controller(),
  fastboot: service(),
  wikiVariables: service(),

  searchId: null,
  // TODO: to be removed as we'll be supporting more errors on search page,
  // see: https://wikia-inc.atlassian.net/browse/DAT-4324
  notFoundError: equal('model.error', 'search-error-not-found'),
  inputPhrase: alias('query'),

  actions: {
    onLoadMore(trackLabel) {
      track({
        action: trackActions.click,
        category: 'wikia-button',
        label: trackLabel,
      });

      this.model.loadMore().then(() => this.trackResultsImpression());
    },

    onResultClick(result) {
      this.trackItemClick(result);
    },
  },

  trackItemClick(result) {
    const payload = {
      searchPhrase: this.inputPhrase,
      clicked: {
        type: 'article', // currently the only displayed type in the search
        id: result.id,
        title: result.title,
        position: result.position + 1, // +1 since we need to start with 1 instead of 0
        thumbnail: false, // we do not show thumbnails on SRP right now
      },
      target: 'redirect',
      app: 'mobile-wiki',
      siteId: this.wikiVariables.id,
      searchId: this.searchId,
      pvUniqueId: window.pvUID,
    };

    M.trackingQueue.push(() => window.trackSearchClicked(payload));
  },

  trackResultsImpression() {
    const payload = {
      searchPhrase: this.inputPhrase,
      filters: {},
      results: this.model.items.map((item, index) => ({ // TODO: all of them or single batch only?
        id: item.id,
        title: item.title,
        position: index + 1, // +1 since we need to start with 1 instead of 0
        thumbnail: false, // we do not show thumbnails on SRP right now
      })),
      page: this.model.batch,
      limit: this.model.items.length, // TODO: total count or single batch count?
      sortOrder: 'default',
      app: 'mobile-wiki',
      siteId: this.wikiVariables.id,
      searchId: this.searchId,
      pvUniqueId: window.pvUID,
    };

    M.trackingQueue.push(() => window.trackSearchImpression(payload));
  },
});
