/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts"/>
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>
'use strict';

App.TrendingVideosItemComponent = Em.Component.extend(App.ViewportMixin, App.TrackClickMixin, {
	tagName: 'a',
	classNames: ['trending-videos-item'],
	attributeBindings: ['href', 'style'],
	thumbnailer: Mercury.Modules.Thumbnailer,
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	href: Em.computed.oneWay('video.fileUrl'),
	imageWidth: 250,
	imageHeight: Em.computed(function (): number {
		return Math.floor(this.get('imageWidth') * 9 / 16);
	}),
	style: null,
	video: null,

	willInsertElement: function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	},

	viewportObserver: Em.observer('viewportDimensions.width', function (): void {
		this.updateImageSize(this.get('viewportDimensions.width'));
	}),

	thumbUrl: Em.computed('video.url', 'video.thumbUrl', function (): void {
		var options: any = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: this.get('cropMode')
			},
			//@TODO OR condition should be removed after app@CONCF-673 gets released to production
			//ETA: 6/25/2015
			videoUrl: string = this.get('video.url') || this.get('video.thumbUrl');

		if (videoUrl) {
			return this.thumbnailer.getThumbURL(videoUrl, options);
		} else {
			return this.emptyGif;
		}
	}),

	updateImageSize: function (viewportWidth: number): void {
		var imageHeightString = String(Math.floor((viewportWidth - 10) * 9 / 16));

		this.set('imageStyle', Em.String.htmlSafe(`height: ${imageHeightString}px;`));
	},

	click: function (): boolean {
		this.trackClick('modular-main-page', 'trending-videos');

		this.sendAction('action', this.get('video'));
		return false;
	}
});
