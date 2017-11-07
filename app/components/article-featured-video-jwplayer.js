import Ember from 'ember';
import VideoLoader from '../modules/video-loader';
import extend from '../utils/extend';
import config from '../config/environment';

const {
	Component,
	inject,
	on,
	observer,
} = Ember;

export default Component.extend({
	ads: inject.service(),

	autoplayCookieName: 'featuredVideoAutoplay',
	autoplayCookieExpireDays: 14,

	// when navigating from one article to another with video, we need to destroy player and
	// reinitialize it as component itself is not destroyed. Could be done with didUpdateAttrs
	// hook, however it is fired twice with new attributes.
	videoIdObserver: on('didInsertElement', observer('model.embed.jsParams.videoId', function () {
		this.destroyVideoPlayer();
		this.initVideoPlayer();
	})),

	init() {
		this._super(...arguments);

		this.set('videoContainerId', `jwplayer-article-video-${new Date().getTime()}`);
	},

	/**
	 * @param {Object} player
	 * @returns {void}
	 */
	onCreate(player) {
		this.player = player;

		this.player.on('autoplayToggle', (data) => {
			$.cookie(this.get('autoplayCookieName'), data.enabled ? '1' : '0', {
				expires: this.get('autoplayCookieExpireDays'),
				path: '/',
				domain: config.cookieDomain
			});
		});
	},

	/**
	 * @returns {void}
	 */
	initVideoPlayer() {
		const model = this.get('model.embed'),
			jsParams = {
				autoplay: $.cookie(this.get('autoplayCookieName')) !== '0',
				adTrackingParams: {
					adProduct: this.get('ads.noAds') ? 'featured-video-no-preroll' : 'featured-video-preroll',
					slotName: 'FEATURED'
				},
				containerId: this.get('videoContainerId'),
				noAds: this.get('ads.noAds'),
				onCreate: this.onCreate.bind(this)
			},
			data = extend({}, model, {jsParams}),
			videoLoader = new VideoLoader(data);

		videoLoader.loadPlayerClass();
	},

	/**
	 * @returns {void}
	 */
	destroyVideoPlayer() {
		if (this.player) {
			this.player.remove();
		}
	}
});
