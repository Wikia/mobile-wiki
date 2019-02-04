import { inject as service } from '@ember/service';
import { equal, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
// import { events } from '../../node_modules/@wikia/search-tracking/dist/searchtracking';
import { track, trackActions } from '../utils/track';

export default Controller.extend({
  application: controller(),
  fastboot: service(),
  wikiVariables: service(),

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

    onResultsImpression() {
      this.trackResultsImpression();
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
      timestamp: new Date().toISOString(),
      beaconId: '', // TODO: get beaconId here
      app: 'mobile-wiki',
      siteId: this.wikiVariables.id,
      siteDomain: '', // TODO: get site domain here,
      searchId: '', // TODO: generate unique search id
      pvUniqueId: '', // TODO: generate unique pageview id
    };

    console.log(payload);
    // sendEvent({ type: events.searchClicked, payload });
  },

  trackResultsImpression() {
    const payload = {
      searchPhrase: this.inputPhrase,
      filters: {}, // TODO: ?????
      results: this.model.items.map((item, index) => {
        return {
          id: item.id,
          title: item.title,
          position: index + 1, // // +1 since we need to start with 1 instead of 0
          thumbnail: false, // we do not show thumbnails on SRP right now
        };
      }),
      offset: this.model.batch, // TODO get it here
      limit: this.model.items.length,
      timestamp: new Date().toISOString(),
      beaconId: '', // TODO: get beaconId here
      app: 'mobile-wiki',
      siteId: this.wikiVariables.id,
      siteDomain: '', // TODO: get site domain here,
      searchId: '', // TODO: generate unique search id
      pvUniqueId: '', // TODO: generate unique pageview id
    };

    console.log(payload);
  },
});
