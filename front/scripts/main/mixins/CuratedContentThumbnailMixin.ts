/// <reference path="../app.ts" />
'use strict';

interface ImageCropData {
	x: number;
	y: number;
	width: number;
	height: number;
}

App.CuratedContentThumbnailMixin = Em.Mixin.create({
	thumbnailer: Mercury.Modules.Thumbnailer,
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

	aspectRatio: Em.computed('block', function (): number {
		return this.get('block') === 'featured' ? 16 / 9 : 1;
	}),

	aspectRatioName: Em.computed('aspectRatio', function (): string {
		return this.get('aspectRatio') === 16 / 9 ? 'landscape' : 'square';
	}),

	imageHeight: Em.computed('aspectRatio', 'imageWidth', function (): number {
		return Math.round(this.get('imageWidth') / this.get('aspectRatio'));
	}),

	generateThumbUrl(imageUrl: string, imageCrop: ImageCropData = null): string {
		var options: any = {
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
