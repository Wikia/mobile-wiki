define('mobile-wiki/components/lightbox-video', ['exports', 'mobile-wiki/mixins/viewport', 'mobile-wiki/modules/video-loader'], function (exports, _viewport, _videoLoader) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_viewport.default, {
		classNames: ['lightbox-video', 'lightbox-content-inner'],
		classNameBindings: ['provider'],
		wrapperClass: '.video-player-wrapper',

		ads: Ember.inject.service(),

		articleContentWidthObserver: Ember.observer('viewportDimensions.width', function () {
			if (this.get('videoLoader')) {
				this.get('videoLoader').onResize();
			}
		}),

		/**
   * @returns string
   */
		provider: Ember.computed('videoLoader', function () {
			var videoLoader = this.get('videoLoader');

			return 'video-provider-' + videoLoader.getProviderName();
		}),

		/**
   * @returns VideoLoader
   */
		videoLoader: Ember.computed('model.embed', function () {
			this.set('model.embed.noAds', this.get('ads.noAds'));

			return new _videoLoader.default(this.get('model.embed'));
		}),

		/**
   * @returns {void}
   */
		didRender: function didRender() {
			this.insertVideoPlayerHtml();
			this.initVideoPlayer();
		},


		/**
   * Used to instantiate a video player
   *
   * @returns {void}
   */
		initVideoPlayer: function initVideoPlayer() {
			var videoLoader = this.get('videoLoader');

			/**
    * This loads and creates a player
    */
			videoLoader.loadPlayerClass();

			// Stop bubbling it up to the lightbox
			this.$(this.wrapperClass).on('click.' + this.id, function () {
				return false;
			});
		},


		/**
   * Since we don't use Ember to inject video HTML
   *
   * Video code does interact with the DOM and brakes binding for Ember templates
   * therefore whenever video changes in lightbox
   * Ember would not know what to update
   *
   * because of that we have to manage it manually
   *
   * @returns {void}
   */
		insertVideoPlayerHtml: function insertVideoPlayerHtml() {
			this.$(this.wrapperClass).html(this.get('model.embed.html'));
		},


		/**
   * Unbind all click events
   *
   * @returns {void}
   */
		willDestroyElement: function willDestroyElement() {
			this.$(this.wrapperClass).off('click.' + this.id);
		}
	});
});