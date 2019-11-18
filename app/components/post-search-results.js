import Component from '@ember/component';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import InViewportMixin from 'ember-in-viewport';
import { getQueryString } from '@wikia/ember-fandom/utils/url';

import { track, trackActions, trackAffiliateUnit } from '../utils/track';
import extend from '../utils/extend';

const DEFAULT_AFFILIATE_SLOT = 1;

function getAffiliateSlot(smallAffiliateUnit, posts) {
  if (!posts || posts.length === 0) {
    return 0;
  }

  const preferredIndex = smallAffiliateUnit.preferredIndex || DEFAULT_AFFILIATE_SLOT;

  if (preferredIndex < posts.length) {
    return posts.length - 1;
  }

  return preferredIndex;
}

export default Component.extend(
  InViewportMixin,
  {
    fetchService: service('fetch'),
    logger: service(),
    wikiVariables: service(),
    affiliateSlots: service(),
    i18n: service(),

    isLoading: true,
    isCrossWiki: false,
    posts: null,
    unit: null,
    debugAffiliateUnits: false,
    isInContent: false,

    seeMoreButtonEnabled: not('isCrossWiki'),

    // fortunately we can compute the feeds path from articlePath (it has lang part)
    seeMoreUrl: computed('wikiVariables.articlePath', function () {
      return this.wikiVariables.articlePath.replace('/wiki/', '/f/');
    }),

    isEnabled: computed('wikiVariables.enableDiscussions', 'isCrossWiki', function () {
    // enabled on cross wiki and if community has discussions enabled
      return this.isCrossWiki || this.get('wikiVariables.enableDiscussions');
    }),

    showPostSearchResultsDisclaimer: computed('posts', function () {
      const isWSDisclaimer = !!document.querySelector('.watch-show__disclaimer');
      const isAffiliateDisclaimer = !!document.querySelector('.affiliate-unit__disclaimer');

      return this.hasAffiliatePost && !isWSDisclaimer && !isAffiliateDisclaimer;
    }),

    hasAffiliatePost: computed('posts', function () {
      return this.posts && this.posts.some(post => post.type === 'affiliate');
    }),

    heading: computed('unit', function () {
      if (this.unit && this.unit.tagline) {
        return this.unit.tagline;
      }
      return this.i18n.t('main.search-post-items-header');
    }),

    didInsertElement() {
      this._super(...arguments);

      if (this.isEnabled) {
        this.fetchResults(this.get('query'));
      }
    },

    actions: {
      trackMoreClick() {
        track({
          action: trackActions.click,
          category: this.isInContent ? 'incontent_posts' : 'search_posts',
          label: 'see-more',
        });
      },
    },

    fetchResults(query) {
      this.setProperties({
        isLoading: true,
      });

      const queryParams = {
        query,
        page: 0,
        lang: this.wikiVariables.language.content,
        limit: 3,
      };

      if (!this.isCrossWiki) {
        queryParams.wikiId = this.wikiVariables.id;
      }

      const queryString = getQueryString(queryParams);

      return this.fetchService.fetchFromUnifiedSearch(`/discussions-search${queryString}`)
        .then(data => this.update(data))
        .catch((e) => {
          this.setProperties({
            isLoading: false,
            posts: null,
          });
          this.logger.error('Search request error', e);

          return this;
        });
    },

    update(state) {
      if (!this.isDestroyed) {
        const results = state.results.map(item => extend({}, item));

        // check query param here
        if (this.unit) {
          const unit = this.unit;
          const preferredIndex = getAffiliateSlot(unit, state.results);
          results.splice(preferredIndex, 0, extend({}, unit, { type: 'affiliate' }));


          if (results.length > 3) {
            results.pop();
          }
        }

        this.setProperties({
          posts: results,
          isLoading: false,
        });

        // make sure this is targeted
        // only fire tracking when there are results
        if (state.results.length) {
          track({
            action: trackActions.impression,
            category: this.isInContent ? 'incontent_posts' : 'search_posts',
            label: 'recent_posts_shown',
          });
        }
      }

      return this;
    },
    didEnterViewport() {
      if (!this.unit) {
        return;
      }

      trackAffiliateUnit(this.unit, {
        action: trackActions.impression,
        category: this.isInContent ? 'affiliate_incontent_posts' : 'affiliate_search_posts',
        label: 'affiliate_shown',
      });
    },
  },
);
