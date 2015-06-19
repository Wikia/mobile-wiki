/// <reference path="../app.ts" />
'use strict';

App.TrendingVideosComponent = Em.Component.extend({
	classNames: ['trending', 'trending-videos'],

	actions: {
		openLightbox: function (video: any): void {
			this.sendAction('openLightbox', video);
		}
	}
});
