import Component from '@ember/component';
import { computed } from '@ember/object';
// TODO: Use when releasing search for all post types
// import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { getQueryString } from '@wikia/ember-fandom/utils/url';

import { track, trackActions } from '../utils/track';
import config from '../config/environment';

// TODO: Remove this when all discussions' posts are in the index
const QUIZZES_WHITELIST = [
  'keikosandbox.fandom.com',
  'keiko-test.fandom.com',
  'gameofthrones.fandom.com',
  'attackontitan.fandom.com',
  'marvelcinematicuniverse.fandom.com',
  'marvel.fandom.com',
  'southpark.fandom.com',
  'starwars.fandom.com',
  'strangerthings.fandom.com',
  'xmenmovies.fandom.com',
  'arrow.fandom.com',
  'bojackhorseman.fandom.com',
  'dc.fandom.com',
  'dcextendeduniverse.fandom.com',
  'disney.fandom.com',
  'fastandfurious.fandom.com',
  'godzilla.fandom.com',
  'lionguard.fandom.com',
  'miraculousladybug.fandom.com',
  'riverdale.fandom.com',
  'spongebob.fandom.com',
  'tardis.fandom.com',
  'thehungergames.fandom.com',
  '13reasonswhy.fandom.com',
  'battlefield.fandom.com',
  'dragonage.fandom.com',
  'acecombat.fandom.com',
  'borderlands.fandom.com',
  'pixelgun-wiki.fandom.com',
];


export default Component.extend({
  fetchService: service('fetch'),
  logger: service(),
  wikiVariables: service(),
  affiliateSlots: service(),

  isLoading: true,
  isCrossWiki: false,
  posts: null,

  // TODO: Use when releasing search for all post types
  // seeMoreButtonEnabled: not('isCrossWiki'),
  seeMoreButtonEnabled: false,

  smallAffiliateUnit: computed('query', function () {
    return this.affiliateSlots.getSmallUnitOnSearch(this.get('query'));
  }),

  bigAffiliateUnit: computed('query', function () {
    return this.affiliateSlots.getBigUnitOnSearch(this.get('query'));
  }),

  // fortunately we can compute the feeds path from articlePath (it has lang part)
  seeMoreUrl: computed('wikiVariables.articlePath', function () {
    return this.wikiVariables.articlePath.replace('/wiki/', '/f/');
  }),

  isEnabled: computed('bigAffiliateUnit', 'wikiVariables.{host,enableDiscussions}', 'isInternal', function () {
    // big unit replaces the entire component and will be displayed instead of it
    if (this.bigAffiliateUnit) {
      return false;
    }

    // Enable on non-production wikis
    if (config.environment !== 'production') {
      return true;
    }

    // TODO: When removing whitelist, delete code below
    // Enable on whitelisted wiki, remove sandbox string from host
    const host = this.wikiVariables.host.replace(/\.sandbox-s[0-9]?/g, '');
    return QUIZZES_WHITELIST.indexOf(host) > -1;

    // TODO: When removing whitelist, enable code block below
    /*
    // on inter-wiki searches disable the module if discussions are not enabled
    if (this.isInternal && !this.get('wikiVariables.enableDiscussions')) {
      return false;
    }

    // otherwise it is enabled
    return true;
    */
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
        category: 'search_posts',
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
      // TODO: Remove when releasing search for all post types
      type: 'quiz',
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
      this.setProperties({
        posts: state.results.map(item => ({
          image: item.image,
          stats: item.stats || {},
          title: item.title,
          type: item.type,
          url: item.url,
        })),
        isLoading: false,
      });

      // only fire tracking when there are results
      if (state.results.length) {
        track({
          action: trackActions.impression,
          category: 'search_posts',
          label: 'recent_posts_shown',
        });
      }
    }

    return this;
  },
});
