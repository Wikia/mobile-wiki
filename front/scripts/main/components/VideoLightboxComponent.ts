/// <reference path="../app.ts" />
'use strict';

App.VideoLightboxComponent = Em.Component.extend({
	classNames: ['video-lightbox'],

	didInsertElement: function (): void {
		this.initVideoPlayer();
	},

	/**
	 * @method initVideoPlayer
	 * @description Used to instantiate a provider specific video player
	 */
	initVideoPlayer: function (): void {
		var currentMedia = this.get('controller.currentMedia'),
			element = $('.lightbox-content-inner')[0];

		if (currentMedia && element) {
			this.set('videoPlayer', new Mercury.Modules.VideoLoader(element, currentMedia.embed));
		}
	}
});
