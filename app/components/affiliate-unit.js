import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import InViewportMixin from 'ember-in-viewport';
import { trackAffiliateUnit, trackActions } from '../utils/track';

export default Component.extend(
  InViewportMixin,
  {
    i18n: service(),

    isInContent: false,
    unit: null,

    classNames: ['affiliate-unit'],

    showAffiiateUnitDisclaimer: !document.querySelector('.watch-show__disclaimer'),

    heading: computed('unit', function () {
      if (this.unit && this.unit.tagline) {
        return this.unit.tagline;
      }
      return this.i18n.t('affiliate-unit.big-unit-heading');
    }),

    getUnitLink: computed('unit', 'isInContent', function () {
      if (this.isInContent && this.unit.links && this.unit.links.article) {
        this.unit.link = this.unit.links.article;
      } else if (!this.isInContent && this.unit.links && this.unit.links.search) {
        this.unit.link = this.unit.links.search;
      }
      return this.unit.link;
    }),

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
