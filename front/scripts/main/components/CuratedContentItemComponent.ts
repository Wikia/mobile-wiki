/// <reference path="../app.ts" />
'use strict';

App.CuratedContentItemComponent = Em.Component.extend({
	classNames: ['curated-content-item'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	imageUrl: Em.computed.oneWay(
		'emptyGif'
	),

	didInsertElement: function (): void {
		if (this.get('url')) {
			this.lazyLoadImage();
		}
	},

	lazyLoadImage: function (): void {
		var options: any = {},
			viewport: number = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			imageSize: number = Math.floor(viewport / 100 * 35),
			imageUrl: string;

		options.width = imageSize;
		options.height = imageSize;
		options.mode = this.get('cropMode');
		imageUrl = this.thumbnailer.getThumbURL(this.get('url'), options);
		this.set('imageUrl', imageUrl);
		this.set('imageSize', imageSize);
	},
});
