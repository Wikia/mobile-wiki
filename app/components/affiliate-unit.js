import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { trackAffiliateUnit, trackActions } from '../utils/track';

export default Component.extend(
  InViewportMixin,
  {
    isIncontent: false,
    unit: null,

    classNames: ['affiliate-unit'],

    actions: {
      trackAffiliateClick() {
        if (this.isIncontent) {
          trackAffiliateUnit(this.unit, {
            action: trackActions.click,
            category: 'affiliate_incontent_recommend',
            label: 'only-item',
          });
        } else {
          trackAffiliateUnit(this.unit, {
            action: trackActions.click,
            category: 'affiliate_search_recommend',
            label: 'only-item',
          });
        }
      },
    },

    didEnterViewport() {
      if (this.isIncontent) {
        trackAffiliateUnit(this.unit, {
          action: trackActions.impression,
          category: 'affiliate_incontent_recommend',
          label: 'affiliate_shown',
        });
      } else {
        trackAffiliateUnit(this.unit, {
          action: trackActions.impression,
          category: 'affiliate_search_recommend',
          label: 'affiliate_shown',
        });
      }
    },
  },
);
