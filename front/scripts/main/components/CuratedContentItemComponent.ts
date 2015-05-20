/// <reference path="../app.ts" />
///<reference path="../mixins/ViewportMixin.ts"/>
///<reference path="../../mercury/modules/Thumbnailer.ts"/>
'use strict';

App.CuratedContentItemComponent = Em.Component.extend(App.ViewportMixin, {
	tagName: Em.computed(function (): string {
		return this.get('model.type') === 'article' ? 'a' : 'div';
	}),
	attributeBindings: ['href'],
	classNames: ['curated-content-item'],
	classNameBindings: ['type'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	thumbnailer: Mercury.Modules.Thumbnailer,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	thumbUrl: Em.computed.oneWay('emptyGif'),
	//@TODO for the purpose of MVP let's make it fixed value, we can adjust later
	imageSize: 200,
	style: null,

	model: null,
	type: Em.computed.oneWay('model.type'),
	href: Em.computed.oneWay('model.url'),
	isArticle: Em.computed.equal('model.type', 'article'),

	willInsertElement: function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	},

	didInsertElement: function (): void {
		if (this.get('model.imageUrl')) {
			this.lazyLoadImage();
		}
	},

	click: function (): void {
		this.sendAction('action', this.get('model'));
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
		thumbUrl = this.thumbnailer.getThumbURL(this.get('model.imageUrl'), options);
		this.set('thumbUrl', thumbUrl);
	},

	updateImageSize: function(viewportSize: number) {
		var imageWidth = String((viewportSize - 20) / 2);
		this.set('style', Em.String.htmlSafe('height: %@px;width: %@px'.fmt(imageWidth, imageWidth)));
	}
});
