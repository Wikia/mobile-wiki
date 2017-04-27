import Ember from 'ember';
import VideoLoader from '../modules/video-loader';
import duration from '../helpers/duration';
import {track, trackActions} from '../utils/track';

const {Component} = Ember;

export default Component.extend(
	{
		classNames: ['article-featured-video'],
		isPlayerLoading: true,

		init() {
			this._super(...arguments);

			this.set('videoContainerId', `ooyala-article-video${new Date().getTime()}`);
		},
		/**
		 * @returns {void}
		 */
		didRender() {
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
			var $video = this.$('.video-container'),
				videoBottomPosition = $video.offset().top + $video.height(),
				showVideoOnScroll = true;

			$(window).on('scroll', { player: this.player, $window: this.$(window) }, function(e) {
				var currentScroll = e.data.$window.scrollTop(),
					$siteHead = this.$('.site-head');

				if (currentScroll >= videoBottomPosition && !$video.hasClass('fixed') ) {
					if (showVideoOnScroll && (e.data.player === undefined || !e.data.player.isPlaying())) {
						$video.addClass('fixed');
						$siteHead.addClass('no-shadow');
					}
				} else if (currentScroll < videoBottomPosition - $video.height() && $video.hasClass('fixed')) {
					$video.removeClass('fixed');
					$siteHead.removeClass('no-shadow');
				}
			});

			$video.find('.video-close-button').on('click', function () {
				$video.removeClass('fixed');
				showVideoOnScroll = false;
			});

			$video.find('.video-thumbnail, .video-placeholder').on('click', { player: this.player }, function (e) {
				e.data.player.mb.publish(OO.EVENTS.WILL_CHANGE_FULLSCREEN, true);
				e.data.player.play();
			});
		},

		willDestroyElement() {
			this._super(...arguments);

			this.player.destroy();
		},

		onCreate(player) {
			this.player = player;

			player.mb.subscribe(window.OO.EVENTS.PLAYBACK_READY, 'ui-title-update', () => {
				const videoTitle = player.getTitle(),
					videoTime = duration.compute([Math.floor(player.getDuration() / 1000)]);

				this.set('videoTitle', videoTitle);
				this.set('videoTime', videoTime);
				this.set('isPlayerLoading', false);
			});

			this.setupTracking(player);
		},

		/**
		 * Used to instantiate a video player
		 *
		 * @returns {void}
		 */
		initVideoPlayer() {
			const data = this.get('model.embed');

			data.jsParams.onCreate = this.onCreate.bind(this);

			data.containerId = this.get('videoContainerId');

			const videoLoader = new VideoLoader(data);

			/**
			 * This loads and creates a player
			 */
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

		actions: {
			playVideo() {
				if (this.player) {
					this.set('isPlayed', true);
					this.player.play();
				}
			}
		}
	}
);
