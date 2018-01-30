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
import {track, trackActions} from '../utils/track';
import duration from '../utils/duration';
import JWPlayerMixin from '../mixins/jwplayer';

export default Component.extend(JWPlayerMixin, {
	ads: service(),
	wikiVariables: service(),

	classNames: ['article-featured-video'],
	classNameBindings: ['isOnScrollActive'],

	attributionAvatarUrl: transparentImageBase64,
	isOnScrollActive: false,

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

	isOnScrollActiveObserver: observer('isOnScrollActive', function () {
		M.tracker.UniversalAnalytics.setDimension(38, this.get('isOnScrollActive') ? 'Yes' : 'No');
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

		this.setPlaceholderDimensions();
		this.throttleOnScroll = this.throttleOnScroll.bind(this);
		window.addEventListener('scroll', this.throttleOnScroll);
		document.body.classList.add('featured-video-on-scroll-active');
	},

	didUpdateAttrs() {
		this.destroyVideoPlayer();
		this.initVideoPlayer();
	},

	willDestroyElement() {
		document.body.classList.remove('featured-video-on-scroll-active');
		window.removeEventListener('scroll', this.throttleOnScroll);
	},

	actions: {
		dismissPlayer() {
			this.set('isOnScrollActive', false);

			if (this.player) {
				this.player.setMute(true);
			}
			// TODO add tracking
			document.body.classList.remove('featured-video-on-scroll-active');

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

	throttleOnScroll() {
		throttle(this, this.onScrollHandler, null, 50, false);
	},

	onScrollHandler() {
		const currentScrollPosition = window.pageYOffset,
			requiredScrollDelimiter = this.$().offset().top,
			isOnScrollActive = this.get('isOnScrollActive');

		if (currentScrollPosition >= requiredScrollDelimiter && !isOnScrollActive) {
			this.set('isOnScrollActive', true);
			// TODO should we track every onscroll impression?
			this.track(trackActions.impression, 'onscroll');
		} else if (currentScrollPosition < requiredScrollDelimiter && isOnScrollActive) {
			this.set('isOnScrollActive', false);
		}
	},

	setPlaceholderDimensions() {
		const placeHolder = this.element.querySelector('.article-featured-video__on-scroll-placeholder'),
			videoContainer = this.element.children[0];

		placeHolder.style.height = `${videoContainer.offsetHeight}px`;
		placeHolder.style.width = `${videoContainer.offsetWidth}px`;
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
