/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
'use strict';

App.FeaturedContentItemComponent = Em.Component.extend({
	tagName: 'figure',
	classNames: ['featured-content-item'],

	cropMode: Mercury.Modules.Thumbnailer.mode.zoomCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	imageUrl: Em.computed.oneWay('emptyGif'),

	// TODO make it more responsive
	imageWidth: 400,
	imageHeight: 225
});
