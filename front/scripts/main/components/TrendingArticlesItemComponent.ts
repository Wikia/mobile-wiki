/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.TrendingArticlesItemComponent = Em.Component.extend(App.ViewportMixin, {
    classNames: ['trending-articles-item'],
    cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	thumbUrl: Em.computed.oneWay('emptyGif'),
    imageHeight: 150,
    imageWidth: 250,

	willInsertElement: function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	},

    didInsertElement: function (): void {
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

		options.width = this.get('imageWidth');
		options.height = this.get('imageHeight');
		options.mode = this.get('cropMode');
		thumbUrl = this.thumbnailer.getThumbURL(this.get('imageUrl'), options);
		this.set('thumbUrl', thumbUrl);
	},

	updateImageSize: function (viewportWidth: number): void {
		var imageWidth = String((viewportWidth - 20) / 2),
			imageHeight = String(Math.round((imageWidth / 16) * 9));

		this.set('style', Em.String.htmlSafe('height: %@px; width: %@px'.fmt(imageHeight, imageWidth)));
		this.set('captionStyle', Em.String.htmlSafe('width: %@px'.fmt(imageWidth)));
	}
});
