define('mobile-wiki/components/article-featured-video-jwplayer', ['exports', 'mobile-wiki/modules/video-loader', 'mobile-wiki/utils/extend'], function (exports, _videoLoader, _extend) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    inject = Ember.inject,
	    on = Ember.on,
	    observer = Ember.observer;
	exports.default = Component.extend({
		ads: inject.service(),

		// when navigating from one article to another with video, we need to destroy player and
		// reinitialize it as component itself is not destroyed. Could be done with didUpdateAttrs
		// hook, however it is fired twice with new attributes.
		videoIdObserver: on('didInsertElement', observer('model.embed.jsParams.videoId', function () {
			this.destroyVideoPlayer();
			this.initVideoPlayer();
		})),

		init: function init() {
			this._super.apply(this, arguments);

			this.set('videoContainerId', 'jwplayer-article-video-' + new Date().getTime());
		},


		/**
   * @param {Object} player
   * @returns {void}
   */
		onCreate: function onCreate(player) {
			this.player = player;
		},


		/**
   * @returns {void}
   */
		initVideoPlayer: function initVideoPlayer() {
			var model = this.get('model.embed'),
			    jsParams = {
				autoplay: true,
				adTrackingParams: {
					adProduct: this.get('ads.noAds') ? 'featured-video-no-preroll' : 'featured-video-preroll',
					slotName: 'FEATURED'
				},
				containerId: this.get('videoContainerId'),
				noAds: this.get('ads.noAds'),
				onCreate: this.onCreate.bind(this)
			},
			    data = (0, _extend.default)({}, model, { jsParams: jsParams }),
			    videoLoader = new _videoLoader.default(data);

			videoLoader.loadPlayerClass();
		},


		/**
   * @returns {void}
   */
		destroyVideoPlayer: function destroyVideoPlayer() {
			if (this.player) {
				this.player.remove();
			}
		}
	});
});