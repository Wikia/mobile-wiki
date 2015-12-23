import Ember from 'ember';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

/**
 * @typedef {Object} ImageCropData
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

export default Ember.Mixin.create({
	thumbnailer: Thumbnailer,
	cropMode: Thumbnailer.mode.topCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

	aspectRatio: Ember.computed('block', function () {
		return this.get('block') === 'featured' ? 16 / 9 : 1;
	}),

	aspectRatioName: Ember.computed('aspectRatio', function () {
		return this.get('aspectRatio') === 16 / 9 ? 'landscape' : 'square';
	}),

	imageHeight: Ember.computed('aspectRatio', 'imageWidth', function () {
		return Math.round(this.get('imageWidth') / this.get('aspectRatio'));
	}),

	/**
	 * @param {string} imageUrl
	 * @param {ImageCropData} [imageCrop=null]
	 * @returns {string}
	 */
	generateThumbUrl(imageUrl, imageCrop = null) {
		const options = {
			width: this.get('imageWidth')
		};

		if (imageCrop) {
			options.mode = this.thumbnailer.mode.windowCrop;
			options.xOffset1 = imageCrop.x;
			options.yOffset1 = imageCrop.y;
			options.xOffset2 = imageCrop.x + imageCrop.width;
			options.yOffset2 = imageCrop.y + imageCrop.height;
		} else {
			options.mode = this.get('cropMode');
			options.height = this.get('imageHeight');
		}

		return this.thumbnailer.getThumbURL(imageUrl, options);
	}
});
