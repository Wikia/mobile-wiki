import Component from '@ember/component';
import { computed } from '@ember/object';

import { trackActions, trackAffiliateUnit } from '../utils/track';

export default Component.extend({
  isInContent: false,

  classNames: ['post-search-results-affiliate-item'],

  getUnitLink: computed('unit', 'isInContent', function () {
    if (this.isInContent && this.affiliateUnit.links && this.affiliateUnit.links.article) {
      this.affiliateUnit.link = this.affiliateUnit.links.article;
    } else if (!this.isInContent && this.affiliateUnit.links && this.affiliateUnit.links.search) {
      this.affiliateUnit.link = this.affiliateUnit.links.search;
    }

    if (this.unit.campaign === 'ddb') {
      const slotName = this.isInContent ? 'incontent_posts' : 'search_posts';
      return `${this.unit.link}&fandom_slot_id=${slotName}`;
    }

    return this.affiliateUnit.link;
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
