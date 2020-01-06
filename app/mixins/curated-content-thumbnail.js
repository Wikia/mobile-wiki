import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import Thumbnailer from '../modules/thumbnailer';
import { transparentImageBase64 } from '../utils/thumbnail';

/**
  * @typedef {Object} ImageCropData
  * @property {number} x
  * @property {number} y
  * @property {number} width
  * @property {number} height
  */
// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  thumbnailer: Thumbnailer,
  cropMode: Thumbnailer.mode.topCrop,
  emptyGif: transparentImageBase64,

  aspectRatio: computed('block', function () {
    return ['featured', 'community'].indexOf(this.block) !== -1 ? 16 / 9 : 1;
  }),

  aspectRatioName: computed('aspectRatio', function () {
    return this.aspectRatio === 16 / 9 ? 'landscape' : 'square';
  }),

  imageHeight: computed('aspectRatio', 'imageWidth', function () {
    return Math.round(this.imageWidth / this.aspectRatio);
  }),

  /**
  * @see The same logic implemented on server side:
  * fastboot-server/app/facets/operations/prepare-curated-main-page-data.js
  * @param {string} imageUrl
  * @param {ImageCropData} [imageCrop=null]
  * @returns {string}
  */
  generateThumbUrl(imageUrl, imageCrop = null) {
    const options = {
      width: this.imageWidth,
    };

    if (imageCrop) {
      options.mode = this.thumbnailer.mode.windowCrop;
      options.xOffset1 = imageCrop.x;
      options.yOffset1 = imageCrop.y;
      options.xOffset2 = imageCrop.x + imageCrop.width;
      options.yOffset2 = imageCrop.y + imageCrop.height;
    } else if (this.isCommunityData) {
      // we need this dimensions only for displaying image here, we don't save it anywhere
      options.width = document.documentElement.clientWidth;
      options.height = Math.round(options.width / this.aspectRatio);
      options.mode = Thumbnailer.mode.thumbnailDown;
    } else {
      options.mode = this.cropMode;
      options.height = this.imageHeight;
    }

    return this.thumbnailer.getThumbURL(imageUrl, options);
  },
});
