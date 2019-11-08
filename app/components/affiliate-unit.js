import Component from '@ember/component';
import { trackAffiliateUnit, trackActions } from '../utils/track';

export default Component.extend({
  isIncontent: false,
  unit: null,

  classNames: ['affiliate-unit'],
  didInsertElement() {
    this._super(...arguments);
    // For showing the disclaimer text
    this.setHasAffiliateUnit();

    if (this.isIncontent) {
      trackAffiliateUnit(this.unit, {
        action: trackActions.impression,
        category: 'mercury-affiliate_incontent_recommend',
        label: 'affiliate_shown',
      });
    } else {
      trackAffiliateUnit(this.unit, {
        action: trackActions.impression,
        category: 'mercury-affiliate_search_recommend',
        label: 'affiliate_shown',
      });
    }
  },
  actions: {
    trackAffiliateClick() {
      if (this.isIncontent) {
        trackAffiliateUnit(this.unit, {
          action: trackActions.click,
          category: 'mercury-affiliate_incontent_recommend',
          label: 'only-item',
        });
      } else {
        trackAffiliateUnit(this.unit, {
          action: trackActions.click,
          category: 'mercury-affiliate_search_recommend',
          label: 'only-item',
        });
      }
    },
  },

});
