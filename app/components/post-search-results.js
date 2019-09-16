import Component from '@ember/component';
import { run } from '@ember/runloop';
import { computed, get, observer } from '@ember/object';
import { inject as service } from '@ember/service';

import config from '../config/environment';

// TODO: Remove this when all discussions' posts are in the index
const quizzes_whitelist = [
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
  wikiVariables: service(),

  isLoaded: false,
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
    return quizzes_whitelist.indexOf(this.get('wikiVariables.host')) > -1;
  }),

  /**
   * @returns {void}
   */
  didInsertElement() {
    this._super(...arguments);
    console.log('wikiVariables', this.get('wikiVariables'));

    //
    const mockedData = [
      {
        wikiId: 0,
        title: 'do you know adrien well',
        content: 'its a terrible quiz good luck getting a 100%',
        rank: 9575.466,
        articleTags: [
          'Adrien Agreste',
        ],
        type: 'quiz',
      },
      {
        wikiId: 0,
        title: 'The color kwamis!',
        content: 'This quiz will test u\'r knowledge about 7 kwamis. Have fun & tell me what u get in the comments!😊👍',
        rank: 9566.112,
        articleTags: [],
        image: 'https://static.wikia.nocookie.net/2dfbaf16-de4d-4138-863c-e60657e00029',
        type: 'quiz',
      },
      {
        wikiId: 0,
        title: 'What do you know about Emilie Agreste?🤓',
        content: 'This Quiz will test your knowledge about Emilie Agreste!💐',
        rank: 9565.443,
        articleTags: [],
        image: 'https://static.wikia.nocookie.net/998bf96c-60f5-4ab9-8ca4-3ac3a11b5c2c',
        type: 'quiz',
      },
    ];

    if (this.isEnabled) {
      // TODO: Instead of this, call API
      run.scheduleOnce('afterRender', this, () => {
        setTimeout(() => {
          if (this.isDestroyed) {
            return;
          }
          this.set('isLoaded', true);
          this.set('posts', this.addFields(mockedData));
        }, 2000);
      });
    }
  },

  addFields(data) {
    return data.map(item => Object.assign({}, item, {
      url: 'https://example.com',
      takers: Math.floor(Math.random() * 1000),
    }));
  },
});
