import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import exists from '../utils/exists';
import { trackAffiliateUnit, trackActions } from '../utils/track';

export default Component.extend(
  InViewportMixin,
  {
    isInContent: false,
    unit: null,

    classNames: ['affiliate-unit'],

    showAffiiateUnitDisclaimer: !exists('.watch-show__disclaimer'),

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
