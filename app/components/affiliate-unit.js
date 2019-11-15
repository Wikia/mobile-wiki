import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import { trackAffiliateUnit, trackActions } from '../utils/track';

export default Component.extend(
  InViewportMixin,
  {
    isInContent: false,
    unit: null,

    classNames: ['affiliate-unit'],

    showAffiiateUnitDisclaimer: document.querySelector('.watch-show__disclaimer') ? false : true,

    actions: {
      trackAffiliateClick() {
        trackAffiliateUnit(this.unit, {
          action: trackActions.click,
          category: this.isInContent ? 'affiliate_incontent_recommend' : 'affiliate_search_recommend',
          label: 'only-item',
        });
      },
    },

    didEnterViewport() {
      trackAffiliateUnit(this.unit, {
        action: trackActions.impression,
        category: this.isInContent ? 'affiliate_incontent_recommend' : 'affiliate_search_recommend',
        label: 'affiliate_shown',
      });
    },
  },
);
