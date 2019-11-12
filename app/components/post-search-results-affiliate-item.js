import Component from '@ember/component';

import { trackActions, trackAffiliateUnit } from '../utils/track';

export default Component.extend({
  isInContent: false,

  classNames: ['post-search-results-affiliate-item'],

  actions: {
    trackClick(number, unit) {
      if (this.isInContent) {
        trackAffiliateUnit(unit, {
          action: trackActions.click,
          category: 'affiliate_incontent_posts',
          label: `item-${parseInt(number, 10)}`,
        });
      } else {
        trackAffiliateUnit(unit, {
          action: trackActions.click,
          category: 'affiliate_search_posts',
          label: `item-${parseInt(number, 10)}`,
        });
      }
    },
  },
});
