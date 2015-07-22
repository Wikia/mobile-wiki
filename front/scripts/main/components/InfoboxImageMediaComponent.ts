/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';

App.InfoboxImageMediaComponent = App.ImageMediaComponent.extend(App.ArticleContentMixin, App.ViewportMixin, {
	imageAspectRatio: 16 / 9,
	layoutName: 'components/image-media',
	hasCaption: false,

	/**
	 * used to set proper height to img tag before it loads
	 * so we have less content jumping around due to lazy loading images
	 * @return number
	 */
	computedHeight: Em.computed('media.width', 'media.height', 'viewportDimensions.width', function (): number {
		var imageWidth = this.get('media.width') || pageWidth,
			imageHeight = this.get('media.height'),
			windowWidth: number = this.get('viewportDimensions.width'),
			computedHeight = imageHeight;

		if (windowWidth < imageWidth) {
			computedHeight = Math.floor(windowWidth * (imageHeight / imageWidth));
		}

		return (windowWidth < computedHeight) ?
			windowWidth :
			computedHeight;
	}),

	/**
	 * @desc return the params for getThumbURL for infobox image.
	 * In case of very high or very wide images, crop them properly.
	 */
	url: Em.computed('media', 'computedHeight', 'articleContent.width', 'imageSrc', 'infoboxImageParams', {
		get(): string {
				var media: ArticleMedia = this.get('media'),
					imageAspectRatio: number = this.get('imageAspectRatio'),
					maximalWidth: number = Math.floor(media.height * imageAspectRatio),
					windowWidth: number = this.get('viewportDimensions.width');

				if (!media) {
					return this.get('imageSrc');
				}

				this.set('limitHeight', true);

				//high image- image higher than square. Make it square.
				if (media.height > media.width) {
					return this.getThumbURL(media.url, {
						mode: Mercury.Modules.Thumbnailer.mode.topCropDown,
						height: windowWidth,
						width: windowWidth
					});
				}

				//wide image- image wider than 16:9 aspect ratio. Crop it to have 16:9 ratio.
				if (media.width > maximalWidth) {
					return this.getThumbURL(media.url, {
						mode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
						height: Math.floor(windowWidth / imageAspectRatio),
						width: windowWidth
					});
				}

				//normal image- size between the 16:9 ratio and square.
				//Compute height with regard to full-screen width of infobox.
				mode = Mercury.Modules.Thumbnailer.mode.thumbnailDown,
				height = Math.floor(windowWidth * (media.height / media.width)),
				width = windowWidth

				return this.getThumbURL(media.url, {
					mode: mode,
					height: height,
					width: width
				});

				//if it got here, that means that we don't have an url for this media
				//this might happen for example for read more section images
			},
			set(key: string, value: string): string {
				return this.getThumbURL(value, {
					mode: Mercury.Modules.Thumbnailer.mode.topCrop,
					height: this.get('computedHeight'),
					width: this.get('articleContent.width')
				});
			}
	})
});
