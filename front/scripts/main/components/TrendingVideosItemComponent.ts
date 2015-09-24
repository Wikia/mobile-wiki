/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.TrendingVideosItemComponent = Em.Component.extend(App.ViewportMixin, App.TrackClickMixin, {
	tagName: 'a',
	classNames: ['trending-videos-item'],
	attributeBindings: ['href'],
	thumbnailer: Mercury.Modules.Thumbnailer,
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	imageStyle: null,
	video: null,
	imageWidth: 250,

	href: Em.computed.oneWay('video.fileUrl'),

	imageHeight: Em.computed('imageWidth', function (): number {
		return Math.floor(this.get('imageWidth') * 9 / 16);
	}),

	thumbUrl: Em.computed('video.url', function (): void {
		var options: any = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: this.get('cropMode')
			},
			videoUrl: string = this.get('video.url');

		if (videoUrl) {
			return this.thumbnailer.getThumbURL(videoUrl, options);
		} else {
			return this.emptyGif;
		}
	}),

	viewportObserver: Em.on('init', Em.observer('viewportDimensions.width', function (): void {
		this.updateImageSize();
	})),

	click(): boolean {
		this.trackClick('modular-main-page', 'trending-videos');

		this.sendAction('action', this.get('video'));
		return false;
	},

	updateImageSize(): void {
		var imageHeightString = String(Math.floor((this.get('viewportDimensions.width') - 10) * 9 / 16));

		this.set('imageStyle', new Em.Handlebars.SafeString(`height: ${imageHeightString}px;`));
	}
});
