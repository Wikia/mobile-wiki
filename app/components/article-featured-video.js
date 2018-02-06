import {inject as service} from '@ember/service';
import {readOnly, reads, oneWay, and} from '@ember/object/computed';
import Component from '@ember/component';
import {on} from '@ember/object/evented';
import {observer, computed} from '@ember/object';
import {htmlSafe} from '@ember/string';
import {throttle} from '@ember/runloop';
import VideoLoader from '../modules/video-loader';
import extend from '../utils/extend';
import {transparentImageBase64} from '../utils/thumbnail';
import config from '../config/environment';
import duration from '../utils/duration';
import JWPlayerMixin from '../mixins/jwplayer';

export default Component.extend(JWPlayerMixin, {
	ads: service(),
	logger: service(),
	wikiVariables: service(),

	classNames: ['article-featured-video'],
	classNameBindings: ['isOnScrollActive'],

	attributionAvatarUrl: transparentImageBase64,
	isOnScrollActive: false,
	isOnScrollClosed: false,
	bodyOnScrollActiveClass: 'featured-video-on-scroll-active',
	onScrollVideoWrapper: null,

	initialVideoDetails: readOnly('model.embed.jsParams.playlist.0'),
	currentVideoDetails: oneWay('initialVideoDetails'),
	metadata: reads('model.metadata'),
	placeholderImage: readOnly('initialVideoDetails.image'),
	hasAttribution: and('currentVideoDetails.{username,userUrl,userAvatarUrl}'),

	// initial video duration is in seconds, related video duration is a formatted string `MM:SS`
	videoDuration: computed('currentVideoDetails', function () {
		const currentVideoDuration = this.get('currentVideoDetails.duration');

		if (this.get('currentVideoDetails') === this.get('initialVideoDetails')) {
			return duration(currentVideoDuration);
		}

		return currentVideoDuration;
	}),

	placeholderStyle: computed('placeholderImage', function () {
		return htmlSafe(`background-image: url(${this.get('placeholderImage')})`);
	}),

	init() {
		this._super(...arguments);

		this.set('videoContainerId', `jwplayer-article-video-${new Date().getTime()}`);
	},

	didInsertElement() {
		this._super(...arguments);

		this.destroyVideoPlayer();
		this.initVideoPlayer();

		if (this.get('hasAttribution')) {
			this.set('attributionAvatarUrl', this.get('currentVideoDetails.userAvatarUrl'));
		}

		this.set('onScrollVideoWrapper', this.element.querySelector('.article-featured-video__on-scroll-video-wrapper'));

		this.setPlaceholderDimensions();
		this.throttleOnScroll = this.throttleOnScroll.bind(this);
		window.addEventListener('scroll', this.throttleOnScroll);
		window.addEventListener('orientationchange', () => {
			if (this.isInLandscapeMode()) {
				this.onScrollStateChange('inactive');
			}
		});
		document.body.classList.add(this.get('bodyOnScrollActiveClass'));
	},

	didUpdateAttrs() {
		this.destroyVideoPlayer();
		this.initVideoPlayer();
	},

	willDestroyElement() {
		document.body.classList.remove(this.get('bodyOnScrollActiveClass'));
		window.removeEventListener('scroll', this.throttleOnScroll);
	},

	actions: {
		dismissPlayer() {
			this.set('isOnScrollClosed', true);
			this.onScrollStateChange('closed');

			if (this.player) {
				this.player.setMute(true);
			}
			document.body.classList.remove(this.get('bodyOnScrollActiveClass'));

			window.removeEventListener('scroll', this.throttleOnScroll);
		}
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

		this.player.on('relatedVideoPlay', ({item}) => {
			this.set('currentVideoDetails', item);
		});

		// this is a hack to fix pause/play issue while scrolling down and on scroll is active on iOS 10.3.2
		this.player.on('pause', ({pauseReason, viewable}) => {
			if (pauseReason === 'autostart' && viewable === 0 && this.get('isOnScrollActive')) {
				this.player.play();
			}
		});

		this.player.on('adPause', ({viewable}) => {
			if (viewable === 0 && this.get('isOnScrollActive')) {
				this.player.play();
			}
		});

		// to make sure custom dimension is set and tracking event is sent
		let onScrollState = this.get('isOnScrollActive') ? 'active' : 'inactive';
		if (this.get('isOnScrollClosed')) {
			onScrollState = 'closed';
		}
		this.onScrollStateChange(onScrollState);

		this.resizeVideo = this.resizeVideo.bind(this);
		this.get('onScrollVideoWrapper').addEventListener('transitionend', this.resizeVideo);
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
			// FIXME this is temporary solution to fix nested glimmer transaction exception which causes application break
			// more info in XW-4600
			try {
				this.player.remove();
			} catch (e) {
				this.get('logger').warn(e);
			}
		}
	},

	setCookie(cookieName, cookieValue) {
		$.cookie(cookieName, cookieValue, {
			expires: this.get('playerCookieExpireDays'),
			path: '/',
			domain: config.cookieDomain
		});
	},

	resizeVideo() {
		this.player.resize();
	},

	throttleOnScroll() {
		throttle(this, this.onScrollHandler, null, 50, false);
	},

	onScrollHandler() {
		if (!this.element) {
			return;
		}

		const currentScrollPosition = window.pageYOffset,
			requiredScrollDelimiter = this.element.getBoundingClientRect().top + window.scrollY,
			isOnScrollActive = this.get('isOnScrollActive'),
			isInLandscapeMode = this.isInLandscapeMode();

		if (!isInLandscapeMode) {
			if (currentScrollPosition >= requiredScrollDelimiter && !isOnScrollActive) {
				this.onScrollStateChange('active');
			} else if (currentScrollPosition < requiredScrollDelimiter && isOnScrollActive) {
				this.onScrollStateChange('inactive');
			}
		}
	},

	setPlaceholderDimensions() {
		const placeHolder = this.element.querySelector('.article-featured-video__on-scroll-placeholder'),
			videoContainer = this.element.children[0];

		placeHolder.style.height = `${videoContainer.offsetHeight}px`;
		placeHolder.style.width = `${videoContainer.offsetWidth}px`;
	},

	onScrollStateChange(state) {
		this.set('isOnScrollActive', state === 'active');
		if (this.player) {
			this.player.trigger('onScrollStateChanged', {state});
		}
	},

	isInLandscapeMode() {
		return Math.abs(window.orientation) === 90;
	}
});
