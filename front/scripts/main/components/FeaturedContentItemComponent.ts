/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />

'use strict';

interface ImageCropData {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}

App.FeaturedContentItemComponent = Em.Component.extend(App.ViewportMixin, {
	tagName: 'a',
	classNames: ['featured-content-item'],
	attributeBindings: ['href', 'style'],

	href: Em.computed.oneWay('model.article_local_url'),
	style: null,

	// TODO make it more responsive
	imageWidth: 400,
	imageHeight: 225,
	imageCropData: Em.computed.oneWay('model.image_crop.landscape'),
	thumbUrl: Em.computed('model', function (): string {
		return this.setThumbUrl(
			this.get('model.image_url'),
			this.get('imageCropData'),
			{
				mode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
				width: this.get('imageWidth'),
				height: this.get('imageHeight')
			}
		);
	}),

	willInsertElement: function (): void {
		this.updateContainerHeight(this.get('viewportDimensions.width'));
	},

	viewportObserver: Em.observer('viewportDimensions.width', function(): void {
		this.updateContainerHeight(this.get('viewportDimensions.width'));
	}),

	/**
	 * @desc Keep the 16:9 ratio
	 */
	updateContainerHeight: function (containerWidth: number) {
		var height = String(Math.round((containerWidth / 16) * 9));
		this.set('style', Em.String.htmlSafe('height: %@px;'.fmt(height)));
	},

	setThumbUrl: function (imageUrl: string, imageCropData: ImageCropData, options: any): void {
		if (imageCropData) {
			options.mode = Mercury.Modules.Thumbnailer.mode.windowCrop;
			options.xOffset1 = imageCropData.x;
			options.yOffset1 = imageCropData.y;
			options.xOffset2 = imageCropData.x + imageCropData.width;
			options.yOffset2 = imageCropData.y + imageCropData.height;
		}

		return Mercury.Modules.Thumbnailer.getThumbURL(imageUrl, options);
	}
});
