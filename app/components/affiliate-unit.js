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

    classNames: ['aff-big-unit'],

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

      if (this.unit.campaign === 'ddb') {
        const slotName = this.isInContent ? 'incontent_recommend' : 'search_recommend';

        let utmContent = '';

        if (this.unit.utmContent) {
          utmContent = `${this.unit.utmContent}_${slotName}`;
        }

        return `${this.unit.link}&fandom_slot_id=${slotName}&${utmContent}`;
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
