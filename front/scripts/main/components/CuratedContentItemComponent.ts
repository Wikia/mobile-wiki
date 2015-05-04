/// <reference path="../app.ts" />
'use strict';

App.CuratedContentItemComponent = Em.Component.extend({
	classNames: ['curated-content-item'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',

	/**
	 * @desc Computed property used to adjust image size
	 */
	imgSize: Em.computed(function (): number {
		var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		return Math.floor(viewport/2) - 24;
	})
});
