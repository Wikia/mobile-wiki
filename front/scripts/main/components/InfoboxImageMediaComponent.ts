/// <reference path="../app.ts" />
/// <reference path="./ImageMediaComponent.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';

App.InfoboxImageMediaComponent = App.ImageMediaComponent.extend(App.ViewportMixin, {
	imageAspectRatio: 16 / 9,
	limitHeight: true,
	normalizeWidth: false,
	cropMode: Mercury.Modules.Thumbnailer.mode.thumbnailDown,
	isInfoboxHeroImage: Em.computed.equal('media.context', 'infobox-hero-image'),

	caption: Em.computed('media.caption', 'isInfoboxHeroImage', function(): string|boolean {
		return this.get('isInfoboxHeroImage') ? false : this.get('media.caption');
	}),

	/**
	 * Extended version of ImageMediaComponent#computedHeight.
	 * Takes into account cropping main infobox images and basing on it's dimensions sets cropping mode.
	 * @return number
	 */
	computedHeight: Em.computed('viewportDimensions.width', 'media.width', 'media.height', 'isInfoboxHeroImage', function (): number {
		var windowWidth: number = this.get('viewportDimensions.width'),
			imageAspectRatio: number = this.get('imageAspectRatio'),
			imageWidth: number = this.get('media.width') || windowWidth,
			imageHeight: number = this.get('media.height'),
			maxWidth: number = Math.floor(imageHeight * imageAspectRatio),
			computedHeight: number = imageHeight;

		//image needs resizing
		if (windowWidth < imageWidth) {
			computedHeight =  Math.floor(windowWidth * (imageHeight / imageWidth));
		}

		//wide image- image wider than 16:9 aspect ratio and inside the HeroImage module
		//Crop it to have 16:9 ratio.
		if (imageWidth > maxWidth && this.get('isInfoboxHeroImage')) {
			this.set('cropMode', Mercury.Modules.Thumbnailer.mode.zoomCrop);
			return Math.floor(windowWidth / imageAspectRatio);
		}

		//high image- image higher than square. Use top-crop-down mode.
		if (windowWidth < computedHeight) {
			this.set('cropMode', Mercury.Modules.Thumbnailer.mode.topCropDown);
			return windowWidth;
		}

		return computedHeight;
	}),

	/**
	 * @desc return the params for getThumbURL for infobox image.
	 * In case of very high or very wide images, crop them properly.
	 */
	url: Em.computed('media', 'computedHeight', 'imageSrc', 'viewportDimensions.width', {
		get(): string {
			var media: ArticleMedia = this.get('media'),
				computedHeight: number = this.get('computedHeight'),
				windowWidth: number = this.get('viewportDimensions.width');

			if (!media) {
				return this.get('imageSrc');
			}

			return this.getThumbURL(media.url, {
				mode: this.get('cropMode'),
				height: computedHeight,
				width: windowWidth
			});
		}
	})
});
