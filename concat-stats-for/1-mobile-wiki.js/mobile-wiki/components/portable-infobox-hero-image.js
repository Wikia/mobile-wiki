define('mobile-wiki/components/portable-infobox-hero-image', ['exports', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/mixins/viewport'], function (exports, _thumbnailer, _viewport) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_viewport.default, {
		imageAspectRatio: 16 / 9,

		// @todo XW-1363 - keep it DRY
		// or should it be the same as in portable-infobox-image-collection?
		cropMode: Ember.computed('viewportDimensions.width', function () {
			var windowWidth = this.get('viewportDimensions.width'),
			    imageAspectRatio = this.get('imageAspectRatio'),
			    imageWidth = this.get('width') || windowWidth,
			    imageHeight = this.get('height'),
			    maxWidth = Math.floor(imageHeight * imageAspectRatio);

			var computedHeight = imageHeight;

			// wide image - crop images wider than 16:9 aspect ratio to 16:9
			if (imageWidth > maxWidth) {
				return _thumbnailer.default.mode.zoomCrop;
			}

			// image needs resizing
			if (windowWidth < imageWidth) {
				computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
			}

			// tall image - use top-crop-down for images taller than square
			if (windowWidth < computedHeight) {
				return _thumbnailer.default.mode.topCropDown;
			}

			return _thumbnailer.default.mode.thumbnailDown;
		}),

		// @todo XW-1363 - keep it DRY
		computedHeight: Ember.computed('viewportDimensions.width', function () {
			var windowWidth = this.get('viewportDimensions.width'),
			    imageAspectRatio = this.get('imageAspectRatio'),
			    imageWidth = this.get('width') || windowWidth,
			    imageHeight = this.get('height'),
			    maxWidth = Math.floor(imageHeight * imageAspectRatio);

			var computedHeight = imageHeight;

			// wide image - crop images wider than 16:9 aspect ratio to 16:9
			if (imageWidth > maxWidth) {
				return Math.floor(windowWidth / imageAspectRatio);
			}

			// image needs resizing
			if (windowWidth < imageWidth) {
				computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
			}

			// tall image - use top-crop-down for images taller than square
			if (windowWidth < computedHeight) {
				return windowWidth;
			}

			return computedHeight;
		}),

		computedWidth: Ember.computed.readOnly('viewportDimensions.width')
	});
});