define('mobile-wiki/components/article-featured-video-ooyala', ['exports', 'mobile-wiki/modules/ads', 'ember-in-viewport', 'mobile-wiki/modules/video-loader', 'mobile-wiki/utils/browser', 'mobile-wiki/utils/extend', 'mobile-wiki/utils/track'], function (exports, _ads, _emberInViewport, _videoLoader, _browser, _extend, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var $ = Ember.$,
	    Component = Ember.Component,
	    inject = Ember.inject,
	    computed = Ember.computed,
	    on = Ember.on,
	    observer = Ember.observer,
	    setProperties = Ember.setProperties,
	    autoplayCookieName = 'featuredVideoAutoplay';
	exports.default = Component.extend(_emberInViewport.default, {
		classNames: ['article-featured-video'],
		classNameBindings: ['hasStartedPlaying', 'isPlayerLoading::is-player-ready', 'isPlaying', 'isVideoDrawerVisible:is-fixed'],

		ads: inject.service(),
		fastboot: inject.service(),
		wikiVariables: inject.service(),

		isPlayerLoading: true,
		supportsAutoplay: computed(function () {
			return _browser.system !== 'ios' || (0, _browser.isSafariMinVer)(10);
		}),
		autoplay: computed(function () {
			return !this.get('fastboot.isFastBoot') && this.get('supportsAutoplay') && $.cookie(autoplayCookieName) !== '0';
		}),
		hasStartedPlaying: computed.oneWay('autoplay'),
		hasTinyPlayIcon: computed.oneWay('isVideoDrawerVisible'),
		isPlaying: computed.oneWay('autoplay'),
		playerLoadingObserver: observer('isPlayerLoading', function () {
			if (this.get('viewportExited')) {
				this.didExitViewport();
			}
		}),

		// when navigating from one article to another with video, we need to destroy player and
		// reinitialize it as component itself is not destroyed. Could be done with didUpdateAttrs
		// hook, however it is fired twice with new attributes.
		videoIdObserver: on('didInsertElement', observer('model.embed.jsParams.videoId', function () {
			this.destroyVideoPlayer();
			this.updateCustomDimensions();
			this.initVideoPlayer();
		})),

		viewportOptionsOverride: on('willRender', function () {
			setProperties(this, {
				viewportSpy: true,
				viewportRefreshRate: 200,
				viewportTolerance: {
					top: $(window).width() * 0.56,
					bottom: 9999
				}
			});
		}),

		init: function init() {
			this._super.apply(this, arguments);

			this.set('videoContainerId', 'ooyala-article-video' + new Date().getTime());
		},
		didEnterViewport: function didEnterViewport() {
			this.set('videoDrawerDismissed', false);
			this.hideVideoDrawer();
		},
		didExitViewport: function didExitViewport() {
			if (this.canVideoDrawerShow()) {
				this.set('isVideoDrawerVisible', true);

				// is-fixed class is intentionally applied to the component manually to make the
				// animation smoother.
				this.element.classList.add('is-fixed');
				this.toggleSiteHeadShadow(false);
			}
		},
		destroyVideoPlayer: function destroyVideoPlayer() {
			if (this.player) {
				this.player.destroy();
			}
		},
		willDestroyElement: function willDestroyElement() {
			this._super.apply(this, arguments);

			this.destroyVideoPlayer();
		},
		onCreate: function onCreate(player) {
			var _this = this;

			this.player = player;

			player.mb.subscribe(window.OO.EVENTS.PLAYBACK_READY, 'featured-video', function () {
				_this.set('isPlayerLoading', false);
			});

			this.setupTracking(player);
		},


		/**
   * Used to instantiate a video player
   *
   * @returns {void}
   */
		initVideoPlayer: function initVideoPlayer() {
			var model = this.get('model.embed'),
			    autoplay = this.get('autoplay'),
			    jsParams = {
				autoplay: autoplay,
				adTrackingParams: {
					adProduct: this.get('ads.noAds') ? 'featured-video-no-preroll' : 'featured-video-preroll',
					slotName: 'FEATURED'
				},
				cacheBuster: this.get('wikiVariables.cacheBuster'),
				containerId: this.get('videoContainerId'),
				initialVolume: autoplay ? 0 : 1,
				noAds: this.get('ads.noAds'),
				onCreate: this.onCreate.bind(this),
				skin: {
					inline: {
						controlBar: {
							autoplayCookieName: autoplayCookieName,
							autoplayToggle: this.get('supportsAutoplay')
						}
					}
				}
			},
			    data = (0, _extend.default)({}, model, { jsParams: jsParams }),
			    videoLoader = new _videoLoader.default(data);

			videoLoader.loadPlayerClass();
		},


		/**
   * Set video-specific data as GA custom dimensions
   *
   * @returns {void}
   */
		updateCustomDimensions: function updateCustomDimensions() {
			M.tracker.UniversalAnalytics.setDimension(34, this.get('model.embed.jsParams.videoId'));
			M.tracker.UniversalAnalytics.setDimension(35, this.get('model.title'));
			M.tracker.UniversalAnalytics.setDimension(36, this.get('model.labels'));
			M.tracker.UniversalAnalytics.setDimension(37, this.get('autoplay') ? 'Yes' : 'No');
		},
		setupTracking: function setupTracking(player) {
			var category = 'article-video';
			var playTime = -1,
			    percentagePlayTime = -1;

			player.mb.subscribe(window.OO.EVENTS.INITIAL_PLAY, 'featured-video', function () {
				(0, _track.track)({
					action: _track.trackActions.playVideo,
					category: category,
					label: 'featured-video'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video', function (eventName, volume) {
				if (volume > 0) {
					(0, _track.track)({
						action: _track.trackActions.click,
						category: category,
						label: 'featured-video-unmuted'
					});
					player.mb.unsubscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video');
				}
			});

			player.mb.subscribe(window.OO.EVENTS.PLAY, 'featured-video', function () {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: 'featured-video-play'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PLAYED, 'featured-video', function () {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: 'featured-video-played'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PAUSE, 'featured-video', function () {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: 'featured-video-paused'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.REPLAY, 'featured-video', function () {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: 'featured-video-replay'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'featured-video', function (eventName, time, totalTime) {
				var secondsPlayed = Math.floor(time),
				    percentage = Math.round(time / totalTime * 100);

				if (secondsPlayed % 5 === 0 && secondsPlayed !== playTime) {
					playTime = secondsPlayed;
					(0, _track.track)({
						action: _track.trackActions.view,
						category: category,
						label: 'featured-video-played-seconds-' + playTime
					});
				}

				if (percentage % 10 === 0 && percentage !== percentagePlayTime) {
					percentagePlayTime = percentage;
					(0, _track.track)({
						action: _track.trackActions.view,
						category: category,
						label: 'featured-video-played-percentage-' + percentagePlayTime
					});
				}
			});

			player.mb.subscribe(window.OO.EVENTS.WIKIA.AUTOPLAY_TOGGLED, 'featured-video', function (eventName, enabled) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: enabled ? 'featured-video-autoplay-enabled' : 'featured-video-autoplay-disabled'
				});
			});

			(0, _track.track)({
				action: _track.trackActions.impression,
				category: category,
				label: 'featured-video'
			});
		},
		canVideoDrawerShow: function canVideoDrawerShow() {
			return !this.get('isVideoDrawerVisible') && !this.get('videoDrawerDismissed') && !this.get('isPlayerLoading') && this.player.getState() !== window.OO.STATE.PLAYING;
		},
		hideVideoDrawer: function hideVideoDrawer() {
			if (this.get('isVideoDrawerVisible')) {
				this.set('isVideoDrawerVisible', false);

				// is-fixed class is intentionally removed from the component manually to make the
				// animation smoother.
				this.element.classList.remove('is-fixed');
				this.toggleSiteHeadShadow(true);
			}
		},
		playInFullScreen: function playInFullScreen(trackingLabel) {
			this.player.mb.publish(window.OO.EVENTS.WILL_CHANGE_FULLSCREEN, true);
			this.play(trackingLabel);
		},
		play: function play(trackingLabel) {
			(0, _track.track)({
				action: _track.trackActions.click,
				category: 'article-video',
				label: trackingLabel
			});

			this.set('hasStartedPlaying', true);
			this.hideVideoDrawer();
			this.player.play();
		},


		actions: {
			playVideo: function playVideo() {
				if (this.player) {
					if (this.get('isVideoDrawerVisible')) {
						this.playInFullScreen('on-scroll-bar');
					} else {
						this.play('inline-video');
					}
				}
			},
			closeVideoDrawer: function closeVideoDrawer() {
				this.set('videoDrawerDismissed', true);
				this.hideVideoDrawer();

				(0, _track.track)({
					action: _track.trackActions.close,
					category: 'article-video',
					label: 'on-scroll-bar'
				});
			}
		}
	});
});