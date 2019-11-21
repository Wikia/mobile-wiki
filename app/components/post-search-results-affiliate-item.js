import Component from '@ember/component';
import { computed } from '@ember/object';

import { trackActions, trackAffiliateUnit } from '../utils/track';

export default Component.extend({
  isInContent: false,

  classNames: ['post-search-results-affiliate-item'],

  getUnitLink: computed('link', function () {
    let unitLink = this.affiliateUnit.link;

    if (this.isInContent && this.affiliateUnit.links.page) {
      unitLink = this.affiliateUnit.links.page;
    } else if (this.affiliateUnit.links.search) {
      unitLink = this.affiliateUnit.links.search;
    }
    return unitLink;
  }),

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
