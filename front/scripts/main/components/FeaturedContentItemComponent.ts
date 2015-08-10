/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentThumbnailMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.FeaturedContentItemComponent = Em.Component.extend(
	App.CuratedContentThumbnailMixin,
	App.ViewportMixin,
{
	block: 'featured',
	tagName: 'a',
	attributeBindings: ['href', 'style'],
	classNames: ['featured-content-item'],

	href: Em.computed.oneWay('model.article_local_url'),
	style: null,

	imageWidth: 400,
	cropMode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(
			this.get('model.image_url'),
			this.get('model.image_crop.' + this.get('aspectRatioName'))
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
		var containerHeight = String(Math.round((containerWidth / 16) * 9));

		this.set('style', Em.String.htmlSafe(`height: ${containerHeight}px;`));
	},
});
