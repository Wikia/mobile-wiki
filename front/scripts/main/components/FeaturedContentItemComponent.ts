/// <reference path="../app.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.FeaturedContentItemComponent = Em.Component.extend(App.ArticleContentMixin, {
	tagName: 'figure',
	classNames: ['featured-content-item'],
	attributeBindings: ['style'],

	cropMode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	imageUrl: Em.computed.oneWay('emptyGif'),

	// TODO make it more responsive
	imageWidth: 400,
	imageHeight: 225,

	/**
	 * @desc Keep the 16:9 ratio
	 */
	containerHeight: Em.computed('containerWidth', function () {
		var containerWidth = this.get('containerWidth') || 0;
		return Math.round((containerWidth / 16) * 9);
	}),

	style: Em.computed('containerHeight', function () {
		return Em.String.htmlSafe('height: %@px;'.fmt(this.get('containerHeight')));
	}),

	didInsertElement: function (): void {
		this.updateContainerWidth();
	},

	/**
	 * @desc Update containerWidth so containerHeight can be recalculated using ratio
	 */
	updateContainerWidth: function (): void {
		this.set('containerWidth', Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
	},

	/**
	 * @desc FIXME this fires only on the first resize, fix observer or do it differently
	 */
	onWindowResize: Em.observer('articleContent.width', function (): void {
		this.updateContainerWidth();
	}),
});
