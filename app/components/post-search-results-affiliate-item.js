import Component from '@ember/component';

import { track, trackActions, trackAffiliateUnit } from '../utils/track';

export default Component.extend({
  isInContent: false,
  classNames: ['post-search-results-affiliate-item'],
  didRender() {
    // So that the search controller can show the disclaimer
    this.setHasAffiliateUnit();
  },
  actions: {
    trackClick(number, unit) {
      trackAffiliateUnit(unit, {
        action: trackActions.click,
        category: 'mercury-affiliate_search_posts',
        label: `item-${parseInt(number, 10) + 2}`, // offset of two is required
      });
    },
  },
});
