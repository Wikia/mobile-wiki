import Ads from '../modules/ads';
import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import VideoLoader from '../modules/video-loader';
import {isSafariMinVer, system} from '../utils/browser';
import extend from '../utils/extend';
import {track, trackActions} from '../utils/track';

const {
		$,
		Component,
		inject,
		computed,
		on,
		observer,
		setProperties
	} = Ember,
	autoplayCookieName = 'featuredVideoAutoplay';

export default Component.extend(InViewportMixin, {
	classNames: ['article-featured-video-jwplayer'],

	ads: inject.service(),
	fastboot: inject.service(),

	autoplay: computed(function () {
		return !this.get('fastboot.isFastBoot') && $.cookie(autoplayCookieName) !== '0';
	}),

	// when navigating from one article to another with video, we need to destroy player and
	// reinitialize it as component itself is not destroyed. Could be done with didUpdateAttrs
	// hook, however it is fired twice with new attributes.
	videoIdObserver: on('didInsertElement', observer('model.embed.jsParams.videoId', function () {
		// this.destroyVideoPlayer();
		// this.updateCustomDimensions();
		this.initVideoPlayer();
	})),

	init() {
		this._super(...arguments);

		this.set('videoContainerId', `jwplayer-article-video${new Date().getTime()}`);
	},

	onCreate() {
		console.log('JW Player loaded!!!!111')
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
				containerId: this.get('videoContainerId'),
				noAds: this.get('ads.noAds'),
				onCreate: this.onCreate.bind(this)
			},
			data = extend({}, model, {jsParams}),
			videoLoader = new VideoLoader(data);

		videoLoader.loadPlayerClass();
	}
});
