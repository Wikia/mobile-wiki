import {inject as service} from '@ember/service';
import {readOnly} from '@ember/object/computed';
import Component from '@ember/component';
import {on} from '@ember/object/evented';
import {observer, computed} from '@ember/object';
import VideoLoader from '../modules/video-loader';
import extend from '../utils/extend';
import config from '../config/environment';
import {inGroup} from '../modules/abtest';
import {track, trackActions} from '../utils/track';

const scrollClassName = 'is-on-scroll-video';

export default Component.extend({
	classNames: ['article-featured-video'],

	ads: service(),
	wikiVariables: service(),
	smartBanner: service(),

	smartBannerVisible: readOnly('smartBanner.smartBannerVisible'),
	isFandomAppSmartBannerVisible: readOnly('smartBanner.isFandomAppSmartBannerVisible'),

	autoplayCookieName: 'featuredVideoAutoplay',
	captionsCookieName: 'featuredVideoCaptions',
	playerCookieExpireDays: 14,
	placeholderImage: computed('model', function () {
		return this.get('model.embed.jsParams.playlist.0.image');
	}),

	// when navigating from one article to another with video, we need to destroy player and
	// reinitialize it as component itself is not destroyed. Could be done with didUpdateAttrs
	// hook, however it is fired twice with new attributes.
	videoIdObserver: on('didInsertElement', observer('model.embed.jsParams.videoId', function () {
		this.destroyVideoPlayer();
		this.initVideoPlayer();
	})),

	actions: {
		/**
		 * FIXME FEATURED VIDEO A/B TEST ONLY
		 */
		dismissPlayer() {
			this.element.classList.remove(scrollClassName);
			this.element.classList.add('is-dismissed');

			this.player.setMute(true);
			this.track(trackActions.click, 'onscroll-close');

			$(window).off('scroll', this.onScrollHandler);
		}
	},

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

		this.player.on('autoplayToggle', ({enabled}) => {
			this.setCookie(this.get('autoplayCookieName'), (enabled ? '1' : '0'));
		});

		this.player.on('captionsSelected', ({selectedLang}) => {
			this.setCookie(this.get('captionsCookieName'), selectedLang);
		});

		/**
		 * FIXME FEATURED VIDEO A/B TEST ONLY
		 */
		this.player.on('play', ({playReason}) => {
			if (playReason === 'interaction' && this.element.classList.contains(scrollClassName)) {
				this.track(trackActions.click, 'onscroll-click');
			}
		});
	},

	/**
	 * @returns {void}
	 */
	initVideoPlayer() {
		const model = this.get('model.embed'),
			jsParams = {
				autoplay: $.cookie(this.get('autoplayCookieName')) !== '0',
				selectedCaptionsLanguage: $.cookie(this.get('captionsCookieName')),
				adTrackingParams: {
					adProduct: this.get('ads.noAds') ? 'featured-video-no-preroll' : 'featured-video-preroll',
					slotName: 'FEATURED'
				},
				containerId: this.get('videoContainerId'),
				noAds: this.get('ads.noAds'),
				onCreate: this.onCreate.bind(this),
				lang: this.get('wikiVariables.language.content')
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
	},

	setCookie(cookieName, cookieValue) {
		$.cookie(cookieName, cookieValue, {
			expires: this.get('playerCookieExpireDays'),
			path: '/',
			domain: config.cookieDomain
		});
	},

	didInsertElement() {
		this.onScrollHandler = this.onScrollHandler.bind(this);

		if (inGroup('FEATURED_VIDEO_VIEWABILITY_VARIANTS', 'ON_SCROLL')) {
			this.setPlaceholderDimensions();
			$(window).on('scroll', this.onScrollHandler);
		}
	},

	willDestroyElement() {
		$(window).off('scroll', this.onScrollHandler);
	},

	/**
	 * FIXME FEATURED VIDEO A/B TEST ONLY
	 */
	onScrollHandler() {
		const currentScrollPosition = window.pageYOffset,
			requiredScrollDelimiter = this.getRequiredScrollDelimiter(),
			hasScrollClass = this.element.classList.contains(scrollClassName);

		if (currentScrollPosition >= requiredScrollDelimiter && !hasScrollClass) {
			this.element.classList.add(scrollClassName);
			this.track(trackActions.impression, 'onscroll');
		} else if (currentScrollPosition < requiredScrollDelimiter && hasScrollClass) {
			this.element.classList.remove(scrollClassName);
		}
	},

	/**
	 * Gets number indicating when video should start floating
	 *
	 * @return {number}
	 */
	getRequiredScrollDelimiter() {
		const compensation = this.get('isFandomAppSmartBannerVisible') ? 85 : 0;

		return this.element.getBoundingClientRect().top + window.scrollY - compensation;
	},

	setPlaceholderDimensions() {
		const placeHolder = this.$('.article-featured-video__on-scroll-placeholder')[0];

		placeHolder.style.height = `${this.element.offsetHeight}px`;
		placeHolder.style.width = `${this.element.offsetWidth}px`;
	},

	/**
	 * @param {String} action
	 * @param {String} label
	 * @returns {void}
	 */
	track(action, label) {
		track({
			action,
			label,
			category: 'featured-video'
		});
	},
});
