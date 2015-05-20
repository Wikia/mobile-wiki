/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.TrendingArticlesItemComponent = Em.Component.extend(App.ViewportMixin, {
	tagName: 'a',
	classNames: ['trending-articles-item'],
	attributeBindings: ['href', 'style'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	imageUrl: Em.computed.oneWay('emptyGif'),
	href: Em.computed.oneWay('url'),
	imageWidth: 250,
	imageHeight: Em.computed(function (): number { return Math.floor(this.get('imageWidth') * 9 / 16); }),
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
			imageUrl: string = this.thumbnailer.getThumbURL(this.get('thumbnail'), options);

		this.set('thumbnail', imageUrl);
	},

	updateImageSize: function (viewportWidth: number): void {
		var componentWidth = String(Math.floor((viewportWidth - 20) / 2));

		this.set('style', Em.String.htmlSafe(`width: ${componentWidth}px`));
	}
});
