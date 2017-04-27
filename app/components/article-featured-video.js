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
		},

		willDestroyElement() {
			this._super(...arguments);

			this.player.destroy();
		},

		onCreate(player) {
			const $videoContainer = this.$('.video-container');

			this.player = player;

			player.mb.subscribe(window.OO.EVENTS.PLAYBACK_READY, 'ui-title-update', () => {
				const videoTitle = player.getTitle(),
					videoTime = duration.compute([Math.floor(player.getDuration() / 1000)]);

				$videoContainer.find('.video-title').text(videoTitle);
				$videoContainer.find('.video-time').text(videoTime);
				$videoContainer.find('.video-details').show();
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
					this.$(`#${this.get('videoContainerId')}`).show();
					this.$('.video-container').find('.video-details').hide();
					this.player.play();
				}
			}
		}
	}
);
