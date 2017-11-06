define('mobile-wiki/modules/hero-image', ['exports', 'mobile-wiki/modules/thumbnailer'], function (exports, _thumbnailer) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var HeroImage = function HeroImage(heroImage, width) {
		_classCallCheck(this, HeroImage);

		var imageAspectRatio = 16 / 9,
		    imageWidth = heroImage.width || width,
		    imageHeight = heroImage.height,
		    maxWidth = Math.floor(imageHeight * imageAspectRatio);

		var computedHeight = imageHeight,
		    cropMode = _thumbnailer.default.mode.thumbnailDown;

		// wide image - crop images wider than 16:9 aspect ratio to 16:9
		if (imageWidth > maxWidth) {
			cropMode = _thumbnailer.default.mode.zoomCrop;
			computedHeight = Math.floor(width / imageAspectRatio);
		}

		// image needs resizing
		if (width < imageWidth) {
			computedHeight = Math.floor(width * (imageHeight / imageWidth));
		}

		// tall image - use top-crop-down for images taller than square
		if (width < computedHeight) {
			cropMode = _thumbnailer.default.mode.topCropDown;
			computedHeight = width;
		}

		this.computedHeight = computedHeight;
		// generate thumbnail
		this.thumbnailUrl = _thumbnailer.default.getThumbURL(heroImage.url, {
			mode: cropMode,
			height: computedHeight,
			width: width
		});
	};

	exports.default = HeroImage;
});