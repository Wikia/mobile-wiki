/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.FeaturedContentItemComponent = Em.Component.extend(App.ViewportMixin, {
	tagName: 'a',
	classNames: ['featured-content-item'],
	attributeBindings: ['href', 'style'],

	cropMode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	imageUrl: Em.computed.oneWay('emptyGif'),
	href: Em.computed.oneWay('url'),
	style: null,

	// TODO make it more responsive
	imageWidth: 400,
	imageHeight: 225,

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
		var height = String(Math.round((containerWidth / 16) * 9));
		this.set('style', Em.String.htmlSafe('height: %@px;'.fmt(height)));
	}
});
