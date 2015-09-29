/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.TrendingArticlesItemComponent = Em.Component.extend(App.ViewportMixin, App.TrackClickMixin, {
	tagName: 'a',
	classNames: ['trending-articles-item'],
	attributeBindings: ['href', 'style'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	style: null,
	imageWidth: 250,

	href: Em.computed.oneWay('url'),
	currentlyRenderedImageUrl: Em.computed('imageUrl', function (): string {
		if (this.get('imageUrl')) {
			var options:any = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: this.get('cropMode')
			};

			return this.thumbnailer.getThumbURL(this.get('imageUrl'), options);
		} else {
			return this.get('emptyGif');
		}
	}),

	imageHeight: Em.computed('imageWidth', function (): number {
		return Math.floor(this.get('imageWidth') * 9 / 16);
	}),

	viewportObserver: Em.on('init', Em.observer('viewportDimensions.width', function (): void {
		this.updateImageSize();
	})),

	click(): void {
		this.trackClick('modular-main-page', 'trending-articles');
	},

	updateImageSize(): void {
		var viewportWidth: number = this.get('viewportDimensions.width'),
			imageWidth = Math.floor((viewportWidth - 20) / 2),
			imageWidthString = String(imageWidth),
			imageHeightString = String(Math.floor(imageWidth * 9 / 16));

		this.setProperties({
			style: new Em.Handlebars.SafeString(`width: ${imageWidthString}px;`),
			imageStyle: new Em.Handlebars.SafeString(`height: ${imageHeightString}px;`)
		});
	}
});
