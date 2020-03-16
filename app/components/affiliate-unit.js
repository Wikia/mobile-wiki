import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import InViewportMixin from 'ember-in-viewport';
import { trackAffiliateUnit, trackActions } from '../utils/track';
import { linkToProxyLink } from '../utils/affiliate';

export default Component.extend(
  InViewportMixin,
  {
    i18n: service(),
    wikiVariables: service(),

    isInContent: false,
    unit: null,
    articleId: null,

    classNames: ['aff-big-unit'],

    wikiId: reads('wikiVariables.id'),

    heading: computed('unit', function () {
      if (this.unit && this.unit.tagline) {
        return this.unit.tagline;
      }
      return this.i18n.t('affiliate-unit.big-unit-heading');
    }),

    getUnitLink: computed('unit', 'isInContent', 'articleId', function () {
      let link;

      if (this.isInContent && this.unit.links && this.unit.links.article) {
        this.unit.link = this.unit.links.article;
      } else if (!this.isInContent && this.unit.links && this.unit.links.search) {
        this.unit.link = this.unit.links.search;
      }

      // add ddb overrides
      if (this.unit.campaign === 'ddb') {
        const slotName = this.isInContent ? 'incontent_recommend' : 'search_recommend';

        let utmContent = '';

        if (this.unit.utmContent) {
          utmContent = `${this.unit.utmContent}_${slotName}`;
        }

        link = `${this.unit.link}&fandom_slot_id=${slotName}&${utmContent}`;
      } else {
        link = this.unit.link;
      }

      return linkToProxyLink(link, this.unit, this.wikiId, this.articleId);
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
