import { inject as service } from '@ember/service';
import { equal, alias } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { events } from '@wikia/search-tracking/dist/searchtracking';
import { track, trackActions } from '../utils/track';

export default Controller.extend({
  application: controller(),
  fastboot: service(),
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

      this.model.loadMore();
    },

    onResultClick(result) {
      const payload = {
        searchPhrase: this.inputPhrase,
        clicked: {
          type: 'article', // currently the only displayed type in the search
          id: 0, // TODO: get article id here
          title: '', // TODO: get article title here
          position: 0, // TODO: get position in search results here
          thumbnail: false, // we do not show thumbnails on SRP right now
        },
        target: 'redirect',
        timestamp: new Date().toISOString(),
        beaconId: '', // TODO: get beaconId here
        app: 'mobile-wiki',
        siteId: 0, // TODO: get wikiId here
        siteDomain: '', // TODO: get site domain here,
        searchId: '', // TODO: generate unique search id
        pvUniqueId: '', // TODO: generate unique pageview id
      };

      console.log(payload);
      sendEvent({ type: events.searchClicked, payload });
    },
  },
});
