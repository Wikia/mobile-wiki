/// <reference path="../app.ts" />
'use strict';

App.VideoLightboxComponent = Em.Component.extend({
	classNames: ['lightbox-content-inner'],
	classNameBindings: ['provider'],
	videoLoader: null,

	didInsertElement: function (): void {
		this.initVideoPlayer();
	},

	/**
	 * @desc Computed property used to set class in template.
	 * On the first launch this.videoLoader will not exist and it return ''.
	 * As soon as the videoLoader will be set, the property will be changed.
	 */
	provider: function (): string {
		var videoLoader = this.get('videoLoader');
		if (videoLoader) {
			return 'video-provider-' + videoLoader.getProviderName();
		}
		return '';
	}.property('videoLoader'),

	/**
	 * @method initVideoPlayer
	 * @desc Used to instantiate a video player
	 */
	initVideoPlayer: function (): void {
		var currentMedia = this.get('controller.currentMedia');
		this.set('videoLoader', new Mercury.Modules.VideoLoader(currentMedia.embed));
	}
});
