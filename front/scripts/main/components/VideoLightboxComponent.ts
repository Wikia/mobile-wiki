/// <reference path="../app.ts" />
'use strict';

App.VideoLightboxComponent = Em.Component.extend({
	classNameBindings: ['provider'],
	provider: null,
	videoLoader: null,
	videoPlayerHTML: '',

	didInsertElement: function (): void {
		this.initVideoPlayer();
		this.set('provider', 'video-provider-' + this.videoLoader.getProviderName())
	},

	/**
	 * @method initVideoPlayer
	 * @description Used to instantiate a provider specific video player
	 */
	initVideoPlayer: function (): void {
		var currentMedia = this.get('controller.currentMedia');
		this.set('videoLoader', new Mercury.Modules.VideoLoader(currentMedia.embed));
	}
});
