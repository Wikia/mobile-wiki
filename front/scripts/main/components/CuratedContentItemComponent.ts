/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentThumbnailMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';

App.CuratedContentItemComponent = Em.Component.extend(
	App.CuratedContentThumbnailMixin,
	App.ViewportMixin,
{
	tagName: 'a',
	attributeBindings: ['href'],
	classNames: ['curated-content-item'],
	classNameBindings: ['type'],
	style: null,
	href: Em.computed.oneWay('model.url'),
	type: Em.computed.oneWay('model.type'),

	isArticle: Em.computed.equal('model.type', 'article'),

	aspectRatio: 1,
	imageWidth: 200,
	thumbUrl: Em.computed.oneWay('emptyGif'),

	icon: Em.computed('type', function (): string {
		var type = this.get('type'),
			typesWithDedicatedIcon = ['category', 'video', 'image', 'blog'],
			iconType: string;

		if (typesWithDedicatedIcon.indexOf(type) > -1) {
			iconType = type;
		} else if (type === 'section') {
			// Sections use the same icons as categories
			iconType = 'category';
		} else {
			// Default icon
			iconType = 'article';
		}

		return 'namespace-' + iconType;
	}),

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

	viewportObserver: Em.observer('viewportDimensions.width', function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	}),

	lazyLoadImage: function (): void {
		this.set('thumbUrl', this.generateThumbUrl(
			this.get('model.imageUrl'),
			this.get(`model.imageCrop.${this.get('aspectRatioName')}`)
		));
	},

	updateImageSize: function (viewportSize: number): void {
		var imageSize = String(Math.floor((viewportSize - 20) / 2));

		this.set('style', Em.String.htmlSafe(`height: ${imageSize}px; width: ${imageSize}px;`));
	}
});
