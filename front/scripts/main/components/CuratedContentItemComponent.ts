/// <reference path="../app.ts" />
///<reference path="../mixins/ViewportMixin.ts"/>
'use strict';

App.CuratedContentItemComponent = Em.Component.extend(App.ViewportMixin, {
	classNames: ['curated-content-item'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	imageUrl: Em.computed.oneWay(
		'emptyGif'
	),
	//@TODO for the purpose of MVP let's make it fixed value, we can adjust later
	imageSize: 200,
	style: null,

	willInsertElement: function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	},

	didInsertElement: function (): void {
		if (this.get('url')) {
			this.lazyLoadImage();
		}
	},

	viewportObserver: Em.observer('viewportDimensions.width', function(): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	}),

	lazyLoadImage: function (): void {
		var options: any = {},
			imageUrl: string;

		options.width = this.get('imageSize');
		options.height = this.get('imageSize');
		options.mode = this.get('cropMode');
		imageUrl = this.thumbnailer.getThumbURL(this.get('url'), options);
		this.set('imageUrl', imageUrl);
	},

	updateImageSize: function(viewportSize) {
		var imageWidth = viewportSize / 2 - 20;
		this.set('style', Em.String.htmlSafe('height: %@px;width: %@px'.fmt(imageWidth, imageWidth)));
	}
});
