import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import VideoLoader from '../modules/video-loader';
import duration from '../helpers/duration';
import {track, trackActions} from '../utils/track';
import extend from '../utils/extend';

const {Component, inject, computed, on, observer} = Ember;

/**
 * Also is-fixed class is intentionally applied to the component manually (not by ember component
 * class binding) to make the animation smoother.
 */
export default Component.extend(InViewportMixin,
	{
		classNames: ['article-featured-video'],
		classNameBindings: [
			'isPlayerLoading::is-player-ready',
			'hasStartedPlaying',
			'isPlaying',
			'withinPortableInfobox:within-portable-infobox:without-portable-infobox'
			// is-fixed class is intentionally applied to the component manually (not by ember
			// component class binding) to make the animation smoother.
		],
		isPlayerLoading: true,
		isPlaying: false,
		hasTinyPlayIcon: computed.or('withinPortableInfobox', 'isVideoDrawerVisible'),
		wikiVariables: inject.service(),

		// when navigating from one article to another with video, we need to destroy player and
		// reinitialize it as component itself is not destroyed. Could be done with didUpdateAttrs
		// hook, however it is fired twice with new attributes.
		videoIdObserver: on('didInsertElement', observer('model.embed.jsParams.videoId', function () {
			this.destroyVideoPlayer();
			this.initVideoPlayer();
		})),

		viewportOptionsOverride: Ember.on('willRender', function () {
			Ember.setProperties(this, {
				viewportSpy: true,
				viewportRefreshRate: 200,
				viewportTolerance: {
					top: this.get('withinPortableInfobox') ? 100 : $(window).width() * 0.56,
					bottom: 9999,
				}
			});
		}),

		init() {
			this._super(...arguments);

			this.set('videoContainerId', `ooyala-article-video${new Date().getTime()}`);
		},

		didEnterViewport() {
			this.set('videoDrawerDismissed', false);
			this.hideVideoDrawer();
		},

		didExitViewport() {
			if (this.canVideoDrawerShow()) {
				this.set('isVideoDrawerVisible', true);

				// is-fixed class is intentionally applied to the component manually (not by ember
				// component class binding) to make the animation smoother.
				this.element.classList.add('is-fixed');
				this.toggleSiteHeadShadow(false);
			}
		},

		destroyVideoPlayer() {
			if (this.player) {
				this.player.destroy();
			}
		},

		willDestroyElement() {
			this._super(...arguments);

			this.destroyVideoPlayer();
		},

		onCreate(player) {
			this.player = player;

			player.mb.subscribe(window.OO.EVENTS.PLAYBACK_READY, 'ui-title-update', () => {
				const videoTitle = player.getTitle(),
					videoTime = duration.compute([Math.floor(player.getDuration() / 1000)]);

				this.setProperties({
					videoTitle,
					videoTime,
					isPlayerLoading: false
				});
			});

			// when playing video on article with infobox, closing fullscreen also has to pause video
			// as it will be not visible
			player.mb.subscribe(window.OO.EVENTS.FULLSCREEN_CHANGED, 'ui-display-update', (name, isFullScreen, paused) => {
				if (this.get('withinPortableInfobox')) {
					this.set('isPlaying', isFullScreen);

					if (!isFullScreen) {
						player.pause();
					}
				}

			});

			this.setupTracking(player);
		},

		/**
		 * Used to instantiate a video player
		 *
		 * @returns {void}
		 */
		initVideoPlayer() {
			const model = this.get('model.embed'),
				jsParams = {
					onCreate: this.onCreate.bind(this),
					containerId: this.get('videoContainerId'),
					cacheBuster: this.get('wikiVariables.cacheBuster')
				},
				data = extend({}, model, {jsParams}),
				videoLoader = new VideoLoader(data);
			videoLoader.loadPlayerClass();
		},

		setupTracking(player) {
			let playTime = -1,
				percentagePlayTime = -1;

			player.mb.subscribe(window.OO.EVENTS.INITIAL_PLAY, 'featured-video', () => {
				track({
					action: trackActions.playVideo,
					category: 'article-video',
					label: 'featured-video'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video', (eventName, volume) => {
				if (volume > 0) {
					track({
						action: trackActions.click,
						category: 'article-video',
						label: 'featured-video-unmuted'
					});
					player.mb.unsubscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video');
				}
			});

			player.mb.subscribe(window.OO.EVENTS.PLAY, 'featured-video', () => {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-play'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PLAYED, 'featured-video', () => {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-played'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PAUSE, 'featured-video', () => {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-paused'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.REPLAY, 'featured-video', () => {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-replay'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'featured-video',
				(eventName, time, totalTime) => {
					let secondsPlayed = Math.floor(time),
						percentage = Math.round(time / totalTime * 100);

					if (secondsPlayed % 5 === 0 && secondsPlayed !== playTime) {
						playTime = secondsPlayed;
						track({
							action: trackActions.view,
							category: 'article-video',
							label: `featured-video-played-seconds-${playTime}`
						});
					}

					if (percentage % 10 === 0 && percentage !== percentagePlayTime) {
						percentagePlayTime = percentage;
						track({
							action: trackActions.view,
							category: 'article-video',
							label: `featured-video-played-percentage-${percentagePlayTime}`
						});
					}
				});

			track({
				action: trackActions.impression,
				category: 'article-video',
				label: 'featured-video'
			});
		},

		canVideoDrawerShow() {
			return !this.get('isVideoDrawerVisible') &&
				!this.get('videoDrawerDismissed') &&
				!this.get('isPlayerLoading') &&
				this.player.getState() !== window.OO.STATE.PLAYING;
		},

		hideVideoDrawer() {
			if (this.get('isVideoDrawerVisible')) {
				this.set('isVideoDrawerVisible', false);
				this.element.classList.remove('is-fixed');
				this.toggleSiteHeadShadow(true);
			}
		},

		playInFullScreen(trackingLabel) {
			this.player.mb.publish(window.OO.EVENTS.WILL_CHANGE_FULLSCREEN, true);
			this.play(trackingLabel);
		},

		play(trackingLabel) {
			track({
				action: trackActions.click,
				category: 'article-video',
				label: trackingLabel
			});

			this.set('hasStartedPlaying', true);
			this.hideVideoDrawer();
			this.player.play();
		},

		actions: {
			playVideo() {
				if (this.player) {
					if (this.get('isVideoDrawerVisible')) {
						this.playInFullScreen('on-scroll-bar');
					} else 	if (this.get('withinPortableInfobox')) {
						this.playInFullScreen('in-portable-infobox-video');
					} else {
						this.play('inline-video');
					}
				}
			},

			closeVideoDrawer() {
				this.set('videoDrawerDismissed', true);
				this.hideVideoDrawer();

				track({
					action: trackActions.close,
					category: 'article-video',
					label: 'on-scroll-bar'
				});
			}
		}
	}
);
