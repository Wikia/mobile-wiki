import Component from '@ember/component';
import { run } from '@ember/runloop';

import config from '../config/environment';

export default Component.extend({
  seeMoreLink: 'http://example.com',
  data: false,
  isLoaded: false,

  /**
   * @returns {void}
   */
  didInsertElement() {
    this._super(...arguments);

    if (this.isEnabled) {
      run.scheduleOnce('afterRender', this, () => {
        setTimeout(() => {
          this.set('isLoaded', true);
          this.set('data', [
            {
              title: 'Poll: If you have a dragon, what color would your dragon be?',
              url: 'http://example.com',
              type: 'poll',
              votes: 1453,
            },
            {
              title: 'Me sitting here wondering what to do now GoT is over.',
              url: 'http://example.com',
              type: 'post',
              lastComment: '3min ago',
              posted: '10min ago',
              imageUrl: '',
            },
            {
              title: 'Interview with Isaac Hempstead Wright confirms that R.R. Martin intended for Bran to be King',
              url: 'http://example.com',
              type: 'post',
              lastComment: null,
              posted: '4min ago',
            },
          ]);
        }, 2000);
      });
    }
  },

  // FIXME: Remove production check
  isEnabled: config.environment !== 'production',
});
