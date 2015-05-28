/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/VideoLoader.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
'use strict';

App.LightboxVideoComponent = Em.Component.extend(App.ArticleContentMixin, {
	classNames: ['lightbox-video', 'lightbox-content-inner'],
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
	provider: Em.computed('videoLoader', function (): string {
		if (this.get('videoLoader')) {
			return 'video-provider-' + this.videoLoader.getProviderName();
		}
		return '';
	}),

	/**
	 * @method initVideoPlayer
	 * @desc Used to instantiate a video player
	 */
	initVideoPlayer: function (): void {
		this.set('videoLoader', new Mercury.Modules.VideoLoader(this.get('model.embed')));
	},

	articleContentWidthObserver: Em.observer('articleContent.width', function (): void {
		if (this.get('videoLoader')) {
			this.get('videoLoader').onResize();
		}
	}),
});
