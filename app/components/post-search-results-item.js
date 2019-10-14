import Component from '@ember/component';
import { computed } from '@ember/object';

import { track, trackActions } from '../utils/track';
import Thumbnailer from '../modules/thumbnailer';

export default Component.extend({
  classNames: ['post-search-results-item'],
  isQuizWithTakes: computed('post', function () {
    const type = this.post.type;
    const stats = this.post.stats;

    return type === 'quiz' && stats && stats.takes && parseInt(stats.takes, 10) > 0;
  }),

  imageThumbnail: computed('post.image', function () {
    const image = this.post.image;

    const options = {
      height: 48,
      mode: Thumbnailer.mode.smart,
      width: 48,
    };

    return image ? Thumbnailer.getThumbURL(image, options) : undefined;
  }),

  actions: {
    trackClick(number) {
      track({
        action: trackActions.click,
        category: 'search_posts',
        label: `item-${parseInt(number, 10) + 1}`,
      });
    },
  },
});
