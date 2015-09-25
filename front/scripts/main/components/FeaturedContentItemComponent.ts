/// <reference path="../app.ts" />
/// <reference path="../mixins/CuratedContentThumbnailMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.FeaturedContentItemComponent = Em.Component.extend(
	App.CuratedContentThumbnailMixin,
	App.ViewportMixin,
{
	tagName: 'a',
	attributeBindings: ['href', 'style'],
	classNames: ['featured-content-item'],
	style: null,
	href: Em.computed.oneWay('model.article_local_url'),

	aspectRatio: 16 / 9,
	imageWidth: 400,
	cropMode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
	thumbUrl: Em.computed('model', function (): string {
		return this.generateThumbUrl(
			this.get('model.image_url'),
			this.get(`model.image_crop.${this.get('aspectRatioName')}`)
		);
	}),

	viewportObserver: Em.on('init', Em.observer('viewportDimensions.width', function (): void {
		this.updateContainerHeight();
	})),

	/**
	 * @desc Keep the 16:9 ratio
	 */
	updateContainerHeight(): void {
		var containerHeight = String(Math.round((this.get('viewportDimensions.width') / 16) * 9));

		this.set('style', new Em.Handlebars.SafeString(`height: ${containerHeight}px;`));
	},
});
