import Ember from 'ember';
import VideoLoader from '../modules/video-loader';
import duration from '../helpers/duration';
import {track, trackActions} from '../utils/track';
import extend from '../utils/extend';

const {Component, inject} = Ember;
let lastTimestamp = 0;

export default Component.extend(
	{
		classNames: ['article-featured-video'],
		classNameBindings: ['isPlayerLoading::is-player-ready', 'isPlayed'],
		isPlayerLoading: true,
		wikiVariables: inject.service(),

		init() {
			this._super(...arguments);

			this.set('videoContainerId', `ooyala-article-video${new Date().getTime()}`);
		},
		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this._super(...arguments);
			this.initVideoPlayer();
			this.initOnScrollBehaviour();
		},

		/**
		 * Manages video transformation on user's scroll action
		 *
		 * @returns {void}
		 */
		initOnScrollBehaviour() {
			const $video = this.$('.article-featured-video__container'),
				videoHeight = $video.height(),
				videoBottomPosition = $video.offset().top + videoHeight;

			requestAnimationFrame(this.onScrollHandler.bind(this, videoBottomPosition));
		},

		onScrollHandler(videoBottomPosition, timestamp) {
			requestAnimationFrame(this.onScrollHandler.bind(this, videoBottomPosition));

			if (timestamp - lastTimestamp > 100) {
				const currentScroll = window.scrollY;

				if (currentScroll > videoBottomPosition && this.canVideoDrawerShow()) {
					this.set('isVideoDrawerVisible', true);
					this.getMainElement().classList.add('is-fixed');
					this.toggleSiteHeadShadow(false);
				} else if (currentScroll < videoBottomPosition) {
					this.set('videoDrawerDismissed', false);
					this.hideVideoDrawer();
				}

				lastTimestamp = timestamp;
			}
		},

		getMainElement() {
			return document.getElementsByClassName(this.get('classNames')[0])[0];
		},

		willDestroyElement() {
			this._super(...arguments);

			if (this.player) {
				this.player.destroy();
			}

			this.$(window).off('scroll.featured-video');
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
				this.getMainElement().classList.remove('is-fixed');
				this.toggleSiteHeadShadow(true);
			}
		},

		actions: {
			playVideo() {
				if (this.player) {
					if (this.get('isVideoDrawerVisible')) {
						this.player.mb.publish(window.OO.EVENTS.WILL_CHANGE_FULLSCREEN, true);
						track({
							action: trackActions.click,
							category: 'article-video',
							label: 'on-scroll-bar'
						});
					}

					this.set('isPlayed', true);
					this.hideVideoDrawer();
					this.player.play();
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
