/// <reference path="../app.ts" />
'use strict';

App.TrendingVideosComponent = Em.Component.extend({
	classNames: ['trending', 'trending-videos', 'mw-content'],

	actions: {
		openLightbox(video: any): void {
			var mediaModel = App.MediaModel.create({
				media: video
			});

			this.sendAction('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: 0
			});
		}
	}
});
