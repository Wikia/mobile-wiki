import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  imageThumbnail: computed('post.image', function () {
    return window.Vignette ? window.Vignette.getThumbURL(post.image, {
      mode: window.Vignette.mode.zoomCrop,
      height: 48,
      width: 48,
    }) : post.image;
  }),
});
