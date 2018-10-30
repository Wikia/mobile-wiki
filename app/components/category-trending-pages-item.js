import Component from '@ember/component';
import { computed } from '@ember/object';
import Thumbnailer from '../modules/thumbnailer';

export default Component.extend(
  {
    classNames: ['category-trending-pages__item'],
    tagName: 'li',

    src: computed('model.thumbnail', function () {
      const options = {
        // 4:3
        width: 180,
        height: 135,
        mode: Thumbnailer.mode.topCrop,
      };

      return Thumbnailer.getThumbURL(this.model.thumbnail, options);
    }),
  },
);
