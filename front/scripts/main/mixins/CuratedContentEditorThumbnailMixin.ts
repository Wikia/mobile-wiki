/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorThumbnailMixin = Em.Mixin.create({
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

	aspectRatio: Em.computed('block', function (): number {
		return this.get('block') === 'featured' ? 16 / 9 : 1;
	}),

	aspectRatioName: Em.computed('block', function (): string {
		return this.get('block') === 'featured' ? 'landscape' : 'square';
	}),

	imageHeight: Em.computed('aspectRatio', 'imageWidth', function (): number {
		return Math.round(this.get('imageWidth') / this.get('aspectRatio'));
	}),

	generateThumbUrl(imageUrl: string, imageCrop: any = null): string {
		var options: any = {
			width: this.get('imageWidth')
		};

		if (imageCrop) {
			options.mode = Mercury.Modules.Thumbnailer.mode.windowCrop;
			options.xOffset1 = parseInt(imageCrop.x);
			options.yOffset1 = parseInt(imageCrop.y);
			options.xOffset2 = parseInt(imageCrop.x) + parseInt(imageCrop.width);
			options.yOffset2 = parseInt(imageCrop.y) + parseInt(imageCrop.height);
		} else {
			options.mode = this.get('cropMode');
			options.height = this.get('imageHeight');
		}

		return this.thumbnailer.getThumbURL(imageUrl, options);
	}
});
