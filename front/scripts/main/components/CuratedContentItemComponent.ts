/// <reference path="../app.ts" />
///<reference path="../mixins/ViewportMixin.ts"/>
'use strict';

App.CuratedContentItemComponent = Em.Component.extend(App.ViewportMixin, {
	classNames: ['curated-content-item'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	thumbUrl: Em.computed.oneWay('emptyGif'),
	//@TODO for the purpose of MVP let's make it fixed value, we can adjust later
	imageSize: 200,
	style: null,

	willInsertElement: function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	},

	didInsertElement: function (): void {
		if (this.get('imageUrl')) {
			this.lazyLoadImage();
		}
	},

	viewportObserver: Em.observer('viewportDimensions.width', function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	}),

	lazyLoadImage: function (): void {
		var options: any = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: this.get('cropMode')
			},
			thumbUrl: string = this.thumbnailer.getThumbURL(this.get('imageUrl'), options);

		this.set('thumbUrl', thumbUrl);
	},

	updateImageSize: function (viewportSize: number): void {
		var imageWidth = String((viewportSize - 20) / 2);

		this.set('style', Em.String.htmlSafe(`height: ${imageWidth}px; width: ${imageWidth}px;`));
	}
});
