import Component from '@ember/component';

import { track, trackActions } from '../utils/track';

export default Component.extend({
  classNames: ['post-search-results-affiliate-item'],
  didRender() {
    // So that the search controller can show the disclaimer
    this.setHasAffiliateUnit();
  },
  actions: {
    trackClick(number) {
      track({
        action: trackActions.click,
        category: 'search_posts',
        label: `item-${parseInt(number, 10) + 2}`, // offset of two is required
      });
    },
  },
});
