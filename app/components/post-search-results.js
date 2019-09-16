import Component from '@ember/component';
import { run } from '@ember/runloop';

import config from '../config/environment';

export default Component.extend({
  posts: null,
  isLoaded: false,
  seeMore: false,

  /**
   * @returns {void}
   */
  didInsertElement() {
    this._super(...arguments);

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

  // FIXME: Remove production check
  isEnabled: config.environment !== 'production',
});
