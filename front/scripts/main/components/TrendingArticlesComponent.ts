/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.TrendingArticlesComponent = Em.Component.extend(App.ViewportMixin, {
    classNames: ['trending-articles'],
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
    imageHeight: 150,
    imageWidth: 250,
    marginOffset: 25,

	willInsertElement: function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	},

    didInsertElement: function(): void {
	    if (this.get('imageUrl')) {
		    this.lazyLoadImage();
	    }
    },

	viewportObserver: Em.observer('viewportDimensions.width', function(): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	}),

	lazyLoadImage: function (): void {
		var options: any = {},
			thumbUrl: string;

		options.width = this.get('imageSize');
		options.height = this.get('imageSize');
		options.mode = this.get('cropMode');
		thumbUrl = this.thumbnailer.getThumbURL(this.get('imageUrl'), options);
		this.set('thumbUrl', thumbUrl);
	},

	updateImageSize: function(viewportSize: number): void {
		var imageWidth = String((viewportSize - 20) / 2);
		this.set('style', Em.String.htmlSafe('height: %@px;width: %@px'.fmt(imageWidth, imageWidth)));
	}
});
