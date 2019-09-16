import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { getQueryString } from '@wikia/ember-fandom/utils/url';

import config from '../config/environment';

// TODO: Remove this when all discussions' posts are in the index
const QUIZZES_WHITELIST = [
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

  isLoading: true,
  isInternal: false,
  posts: null,
  seeMore: false,

  // fortuneatly we can compute the feeds path from articlePath (it has lang part)
  feedsUrl: computed('wikiVariables.articlePath', function () {
    return this.get('wikiVariables.articlePath').replace('/wiki/', '/f/');
  }),

  isEnabled: computed('wikiVariables.host', function () {
    // Enable on non-production wikis
    if (config.environment !== 'production') {
      return true;
    }

    // Enable on whitelisted wiki
    return QUIZZES_WHITELIST.indexOf(this.get('wikiVariables.host')) > -1;
  }),

  didInsertElement() {
    this._super(...arguments);

    if (this.isEnabled) {
      this.fetchResults(this.get('query'));
    }
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

    if (this.isInternal) {
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
        // TODO: read from results, not from the mocked data
        posts: state.results.map(item => ({
          image: item.image,
          takers: item.takers || 0,
          title: item.title,
          url: item.url,
        })),
        isLoading: false,
      });
    }

    return this;
  },
});
