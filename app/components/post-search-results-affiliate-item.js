import Component from '@ember/component';
import { action, computed } from '@ember/object';

import { trackActions, trackAffiliateUnit } from '../utils/track';

export default Component.extend({
  isInContent: false,

  classNames: ['post-search-results-affiliate-item'],

  getUnitLink: computed('affiliateUnit', 'isInContent', function () {
    if (this.isInContent && this.affiliateUnit.links && this.affiliateUnit.links.article) {
      this.affiliateUnit.link = this.affiliateUnit.links.article;
    } else if (!this.isInContent && this.affiliateUnit.links && this.affiliateUnit.links.search) {
      this.affiliateUnit.link = this.affiliateUnit.links.search;
    }

    if (this.affiliateUnit.campaign === 'ddb') {
      const slotName = this.isInContent ? 'incontent_posts' : 'search_posts';
      return `${this.affiliateUnit.link}&fandom_slot_id=${slotName}`;
    }

    return this.affiliateUnit.link;
  }),

  @action
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
});
