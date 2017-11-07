import {inject as service} from '@ember/service';
import {oneWay} from '@ember/object/computed';
import $ from 'jquery';
import Component from '@ember/component';
import {on} from '@ember/object/evented';
import {setProperties, observer, computed} from '@ember/object';
import Ads from '../modules/ads';
import InViewportMixin from 'ember-in-viewport';
import VideoLoader from '../modules/video-loader';
import {isSafariMinVer, system} from '../utils/browser';
import extend from '../utils/extend';
import {track, trackActions} from '../utils/track';

const autoplayCookieName = 'featuredVideoAutoplay';

export default Component.extend(InViewportMixin, {
	classNames: ['article-featured-video'],
	classNameBindings: [
		'hasStartedPlaying',
		'isPlayerLoading::is-player-ready',
		'isPlaying',
		'isVideoDrawerVisible:is-fixed'
	],

	ads: service(),
	fastboot: service(),
	wikiVariables: service(),

	isPlayerLoading: true,
	supportsAutoplay: computed(() => {
		return system !== 'ios' || isSafariMinVer(10);
	}),
	autoplay: computed(function () {
		return !this.get('fastboot.isFastBoot') &&
			this.get('supportsAutoplay') &&
			$.cookie(autoplayCookieName) !== '0';
	}),
	hasStartedPlaying: oneWay('autoplay'),
	hasTinyPlayIcon: oneWay('isVideoDrawerVisible'),
	isPlaying: oneWay('autoplay'),
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

			// is-fixed class is intentionally applied to the component manually to make the
			// animation smoother.
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

		player.mb.subscribe(window.OO.EVENTS.PLAYBACK_READY, 'featured-video', () => {
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
		const model = this.get('model.embed'),
			autoplay = this.get('autoplay'),
			jsParams = {
				autoplay,
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
							autoplayCookieName,
							autoplayToggle: this.get('supportsAutoplay')
						}
					}
				}
			},
			data = extend({}, model, {jsParams}),
			videoLoader = new VideoLoader(data);

		videoLoader.loadPlayerClass();
	},

	/**
	 * Set video-specific data as GA custom dimensions
	 *
	 * @returns {void}
	 */
	updateCustomDimensions() {
		M.tracker.UniversalAnalytics.setDimension(34, this.get('model.embed.jsParams.videoId'));
		M.tracker.UniversalAnalytics.setDimension(35, this.get('model.title'));
		M.tracker.UniversalAnalytics.setDimension(36, this.get('model.labels'));
		M.tracker.UniversalAnalytics.setDimension(37, this.get('autoplay') ? 'Yes' : 'No');
	},

	setupTracking(player) {
		const category = 'article-video';
		let playTime = -1,
			percentagePlayTime = -1;

		player.mb.subscribe(window.OO.EVENTS.INITIAL_PLAY, 'featured-video', () => {
			track({
				action: trackActions.playVideo,
				category,
				label: 'featured-video'
			});
		});

		player.mb.subscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video', (eventName, volume) => {
			if (volume > 0) {
				track({
					action: trackActions.click,
					category,
					label: 'featured-video-unmuted'
				});
				player.mb.unsubscribe(window.OO.EVENTS.VOLUME_CHANGED, 'featured-video');
			}
		});

		player.mb.subscribe(window.OO.EVENTS.PLAY, 'featured-video', () => {
			track({
				action: trackActions.click,
				category,
				label: 'featured-video-play'
			});
		});

		player.mb.subscribe(window.OO.EVENTS.PLAYED, 'featured-video', () => {
			track({
				action: trackActions.click,
				category,
				label: 'featured-video-played'
			});
		});

		player.mb.subscribe(window.OO.EVENTS.PAUSE, 'featured-video', () => {
			track({
				action: trackActions.click,
				category,
				label: 'featured-video-paused'
			});
		});

		player.mb.subscribe(window.OO.EVENTS.REPLAY, 'featured-video', () => {
			track({
				action: trackActions.click,
				category,
				label: 'featured-video-replay'
			});
		});

		player.mb.subscribe(
			window.OO.EVENTS.PLAYHEAD_TIME_CHANGED,
			'featured-video',
			(eventName, time, totalTime) => {
				let secondsPlayed = Math.floor(time),
					percentage = Math.round(time / totalTime * 100);

				if (secondsPlayed % 5 === 0 && secondsPlayed !== playTime) {
					playTime = secondsPlayed;
					track({
						action: trackActions.view,
						category,
						label: `featured-video-played-seconds-${playTime}`
					});
				}

				if (percentage % 10 === 0 && percentage !== percentagePlayTime) {
					percentagePlayTime = percentage;
					track({
						action: trackActions.view,
						category,
						label: `featured-video-played-percentage-${percentagePlayTime}`
					});
				}
			}
		);

		player.mb.subscribe(
			window.OO.EVENTS.WIKIA.AUTOPLAY_TOGGLED,
			'featured-video',
			(eventName, enabled) => {
				track({
					action: trackActions.click,
					category,
					label: enabled ? 'featured-video-autoplay-enabled' : 'featured-video-autoplay-disabled'
				});
			}
		);

		track({
			action: trackActions.impression,
			category,
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

			// is-fixed class is intentionally removed from the component manually to make the
			// animation smoother.
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
});
