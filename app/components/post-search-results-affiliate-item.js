import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import { trackActions, trackAffiliateUnit } from '../utils/track';
import { linkToProxyLink } from '../utils/affiliate';

export default Component.extend({
  wikiVariables: service(),

  isInContent: false,
  articleId: null,

  classNames: ['post-search-results-aff-item'],

  wikiId: reads('wikiVariables.id'),

  getUnitLink: computed('affiliateUnit', 'isInContent', 'articleId', 'wikiId', function () {
    let link;
    if (this.isInContent && this.affiliateUnit.links && this.affiliateUnit.links.article) {
      this.affiliateUnit.link = this.affiliateUnit.links.article;
    } else if (!this.isInContent && this.affiliateUnit.links && this.affiliateUnit.links.search) {
      this.affiliateUnit.link = this.affiliateUnit.links.search;
    }

    if (this.affiliateUnit.campaign === 'ddb') {
      const slotName = this.isInContent ? 'incontent_posts' : 'search_posts';
      link = `${this.affiliateUnit.link}&fandom_slot_id=${slotName}`;
    } else {
      link = this.affiliateUnit.link;
    }

    return linkToProxyLink(link, this.affiliateUnit, this.wikiId, this.articleId);
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
