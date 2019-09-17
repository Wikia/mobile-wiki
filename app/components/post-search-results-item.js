import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isQuizWithTakes: computed('post.{type,stats,stats.takes}', function () {
    const type = this.post.type;
    const stats = this.post.stats;

    return type === 'quiz' && stats && stats.takes && parseInt(stats.takes, 10) > 0;
  }),

  imageThumbnail: computed('post.image', function () {
    const image = this.post.image;

    return window.Vignette ? window.Vignette.getThumbURL(image, {
      mode: window.Vignette.mode.zoomCrop,
      height: 48,
      width: 48,
    }) : image;
  }),
});
