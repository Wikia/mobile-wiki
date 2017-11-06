define('mobile-wiki/mixins/curated-content-thumbnail', ['exports', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/mixins/viewport'], function (exports, _thumbnailer, _viewport) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var computed = Ember.computed;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create(_viewport.default, {
		thumbnailer: _thumbnailer.default,
		cropMode: _thumbnailer.default.mode.topCrop,
		emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

		aspectRatio: computed('block', function () {
			return ['featured', 'community'].indexOf(this.get('block')) !== -1 ? 16 / 9 : 1;
		}),

		aspectRatioName: computed('aspectRatio', function () {
			return this.get('aspectRatio') === 16 / 9 ? 'landscape' : 'square';
		}),

		imageHeight: computed('aspectRatio', 'imageWidth', function () {
			return Math.round(this.get('imageWidth') / this.get('aspectRatio'));
		}),

		/**
   * @see The same logic implemented on server side:
   * fastboot-server/app/facets/operations/prepare-curated-main-page-data.js
   * @param {string} imageUrl
   * @param {ImageCropData} [imageCrop=null]
   * @returns {string}
   */
		generateThumbUrl: function generateThumbUrl(imageUrl) {
			var imageCrop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var options = {
				width: this.get('imageWidth')
			};

			if (imageCrop) {
				options.mode = this.thumbnailer.mode.windowCrop;
				options.xOffset1 = imageCrop.x;
				options.yOffset1 = imageCrop.y;
				options.xOffset2 = imageCrop.x + imageCrop.width;
				options.yOffset2 = imageCrop.y + imageCrop.height;
			} else if (this.get('isCommunityData')) {
				// we need this dimensions only for displaying image here, we don't save it anywhere
				options.width = this.get('viewportDimensions.width');
				options.height = Math.round(options.width / this.get('aspectRatio'));
				options.mode = _thumbnailer.default.mode.thumbnailDown;
			} else {
				options.mode = this.get('cropMode');
				options.height = this.get('imageHeight');
			}

			return this.thumbnailer.getThumbURL(imageUrl, options);
		}
	});
});