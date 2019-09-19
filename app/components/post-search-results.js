import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { getQueryString } from '@wikia/ember-fandom/utils/url';

import config from '../config/environment';

// TODO: Remove this when all discussions' posts are in the index
const QUIZZES_WHITELIST = [
  // test communities
  'keikosandbox.fandom.com',
  'keiko-test.fandom.com',
  'gameofthrones.bartosz.fandom-dev.us',
  'gameofthrones.chriss.fandom-dev.us',
  'xkxd02.mattk.fandom-dev.us',
  'xkxd02.jrogan.fandom-dev.us',
  'xkxd02.chriss.fandom-dev.us',
  'xkxd02.bartosz.fandom-dev.us',
  'keikosandbox.sandbox-s3.fandom.com',
  'keikosandbox.sandbox-s4.fandom.com',
  'keiko-test.sandbox-s3.fandom.com',
  'keiko-test.sandbox-s4.fandom.com',
  // FIXME: Enable when we want to launch on Quizzes' Communities
  // 'gameofthrones.fandom.com',
  // 'attackontitan.fandom.com',
  // 'marvelcinematicuniverse.fandom.com',
  // 'marvel.fandom.com',
  // 'southpark.fandom.com',
  // 'starwars.fandom.com',
  // 'strangerthings.fandom.com',
  // 'xmenmovies.fandom.com',
  // 'arrow.fandom.com',
  // 'bojackhorseman.fandom.com',
  // 'dc.fandom.com',
  // 'dcextendeduniverse.fandom.com',
  // 'disney.fandom.com',
  // 'fastandfurious.fandom.com',
  // 'godzilla.fandom.com',
  // 'lionguard.fandom.com',
  // 'miraculousladybug.fandom.com',
  // 'riverdale.fandom.com',
  // 'spongebob.fandom.com',
  // 'tardis.fandom.com',
  // 'thehungergames.fandom.com',
  // '13reasonswhy.fandom.com',
  // 'battlefield.fandom.com',
  // 'dragonage.fandom.com',
  // 'acecombat.fandom.com',
  // 'borderlands.fandom.com',
  // 'pixelgun-wiki.fandom.com',
];


export default Component.extend({
  fetchService: service('fetch'),
  logger: service(),
  wikiVariables: service(),

  isLoading: true,
  isCrossWiki: false,
  posts: null,
  isNotCrossWiki: not('isCrossWiki'),

  // fortunately we can compute the feeds path from articlePath (it has lang part)
  feedsUrl: computed('wikiVariables.articlePath', function () {
    return this.get('wikiVariables.articlePath').replace('/wiki/', '/f/');
  }),

  isEnabled: computed('wikiVariables.{host,enableFeedsAndPosts}', 'isInternal', function () {
    // Enable on non-production wikis
    if (config.environment !== 'production') {
      return true;
    }


    // TODO: When removing whitelist, delete code below
    // Enable on whitelisted wiki
    return QUIZZES_WHITELIST.indexOf(this.get('wikiVariables.host')) > -1;

    // TODO: When removing whitelist, enable code block below
    /*
    // on inter-wiki searches disable the module if discussions are not enabled
    if (this.isInternal && !this.get('wikiVariables.enableFeedsAndPosts')) {
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

    if (this.isNotCrossWiki) {
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
    }

    return this;
  },
});
