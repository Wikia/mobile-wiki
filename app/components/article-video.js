import Ember from 'ember';
import VideoLoader from '../modules/video-loader';
import { track, trackActions } from '../utils/track'

export default Ember.Component.extend(
	{
		init() {
			this._super(...arguments);
			this.set('videoContainerId', 'ooyala-article-video' + new Date().getTime());
		},
		/**
		 * @returns {void}
		 */
		didRender() {
			this.initVideoPlayer();
		},

		willDestroyElement() {
			this.player.destroy();
		},

		getFormattedDuration(millisec) {
			let seconds = parseInt(millisec / 1000, 10);
			let hours = parseInt(seconds / 3600, 10);
			seconds = seconds % 3600;
			let minutes = parseInt(seconds / 60, 10);
			seconds = seconds % 60;
			let duration = '';
			if (hours > 0) {
				duration += hours + ':';
				if (minutes < 10) {
					duration += '0';
				}
			}
			duration += minutes + ':';
			if (seconds < 10) {
				duration += '0';
			}
			return duration + seconds;
		},

		/**
		 * Used to instantiate a video player
		 *
		 * @returns {void}
		 */
		initVideoPlayer() {
			const data = this.get('model.embed'),
				$videoContainer = this.$('.video-container');

			data.jsParams.onCreate = (player) => {
				this.player = player;

				player.mb.subscribe(window.OO.EVENTS.PLAYBACK_READY, 'ui-title-update', () => {
					const videoTitle = player.getTitle(),
						videoTime = this.getFormattedDuration(player.getDuration());

					$videoContainer.find('.video-title').text(videoTitle);
					$videoContainer.find('.video-time').text(videoTime);
					$videoContainer.find('.video-placeholder').show();
				});

				this.setupTracking(player);
			};

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

			player.mb.subscribe(window.OO.EVENTS.INITIAL_PLAY, 'featured-video', function () {
				track({
					action: trackActions.playVideo,
					category: 'article-video',
					label: 'featured-video'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video', function (eventName, volume) {
				if (volume > 0) {
					track({
						action: trackActions.click,
						category: 'article-video',
						label: 'featured-video-unmuted'
					});
					player.mb.unsubscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video');
				}
			});

			player.mb.subscribe(window.OO.EVENTS.PLAY, 'featured-video', function () {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-play'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PLAYED, 'featured-video', function () {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-played'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PAUSE, 'featured-video', function () {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-paused'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.REPLAY, 'featured-video', function () {
				track({
					action: trackActions.click,
					category: 'article-video',
					label: 'featured-video-replay'
				});
			});

			player.mb.subscribe(window.OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'featured-video', function (eventName, time, totalTime) {
				let secondsPlayed = Math.floor(time),
					percentage = Math.round(time / totalTime * 100);

				if (secondsPlayed % 5 === 0 && secondsPlayed !== playTime) {
					playTime = secondsPlayed;
					track({
						action: trackActions.view,
						category: 'article-video',
						label: 'featured-video-played-seconds-' + playTime
					});
				}

				if (percentage % 10 === 0 && percentage !== percentagePlayTime) {
					percentagePlayTime = percentage;
					track({
						action: trackActions.view,
						category: 'article-video',
						label: 'featured-video-played-percentage-' + percentagePlayTime
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
				this.$('#' + this.get('videoContainerId')).show();
				this.$('.video-container').find('.video-details').hide();
				this.player.play();
			}
		}
	}
);
