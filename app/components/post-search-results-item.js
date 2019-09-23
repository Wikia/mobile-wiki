import Component from '@ember/component';
import { computed } from '@ember/object';

import Thumbnailer from '../modules/thumbnailer';

export default Component.extend({
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
});
