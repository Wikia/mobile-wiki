import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import Thumbnailer from '../modules/thumbnailer';
import { track, trackActions } from '../utils/track';
import { transparentImageBase64 } from '../utils/thumbnail';

export default Component.extend({
  tagName: 'a',
  classNames: ['trending-articles-item'],
  attributeBindings: ['href', 'style'],
  style: null,
  imageWidth: 250,
  emptyGif: transparentImageBase64,

  href: oneWay('url'),

  currentlyRenderedImageUrl: computed('imageUrl', function () {
    if (this.imageUrl) {
      const options = {
        width: this.imageWidth,
        height: this.imageHeight,
        mode: Thumbnailer.mode.topCrop,
      };

      return Thumbnailer.getThumbURL(this.imageUrl, options);
    } else {
      return undefined;
    }
  }),

  imageHeight: computed('imageWidth', function () {
    return Math.floor(this.imageWidth * 9 / 16);
  }),

  /**
	 * @returns {void}
	 */
  click() {
    track({
      action: trackActions.click,
      category: 'main-page-trending-articles',
      label: `open-item-${this.index}`,
    });
  },
});
