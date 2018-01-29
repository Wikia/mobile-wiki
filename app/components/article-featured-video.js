import {inject as service} from '@ember/service';
import {readOnly, reads, oneWay, and} from '@ember/object/computed';
import Component from '@ember/component';
import {on} from '@ember/object/evented';
import {observer, computed} from '@ember/object';
import {htmlSafe} from '@ember/string';
import VideoLoader from '../modules/video-loader';
import extend from '../utils/extend';
import {transparentImageBase64} from '../utils/thumbnail';
import config from '../config/environment';
import {track, trackActions} from '../utils/track';
import JWPlayerMixin from '../mixins/jwplayer';

// FIXME: After FeaturedVideo AB test is finished, consider removing inclusion of this mixin
import RenderComponentMixin from '../mixins/render-component';

const scrollClassName = 'is-on-scroll-video';

export default Component.extend(RenderComponentMixin, JWPlayerMixin, {
	ads: service(),
	wikiVariables: service(),
	smartBanner: service(),

	classNames: ['article-featured-video'],

	// transparent gif
	attributionAvatarUrl: transparentImageBase64,

	smartBannerVisible: readOnly('smartBanner.smartBannerVisible'),
	isFandomAppSmartBannerVisible: readOnly('smartBanner.isFandomAppSmartBannerVisible'),

	initialVideoDetails: readOnly('model.embed.jsParams.playlist.0'),
	currentVideoDetails: oneWay('initialVideoDetails'),
	metadata: reads('model.metadata'),
	placeholderImage: readOnly('initialVideoDetails.image'),
	hasAttribution: and('currentVideoDetails.{username,userUrl,userAvatarUrl}'),

	placeholderStyle: computed('placeholderImage', function () {
		return htmlSafe(`background-image: url(${this.get('placeholderImage')})`);
	}),

	init() {
		this._super(...arguments);

		this.set('videoContainerId', `jwplayer-article-video-${new Date().getTime()}`);
	},

	didInsertElement() {
		this._super(...arguments);

		this.onScrollHandler = this.onScrollHandler.bind(this);

		this.destroyVideoPlayer();
		this.initVideoPlayer();

		if (this.get('hasAttribution')) {
			this.set('attributionAvatarUrl', this.get('currentVideoDetails.userAvatarUrl'));
		}

		this.setPlaceholderDimensions();
		$(window).on('scroll', this.onScrollHandler);
		this.$().addClass('on-scroll-variant');
		document.body.classList.add('featured-video-on-scroll-active');
	},

	didUpdateAttrs() {
		this.destroyVideoPlayer();
		this.initVideoPlayer();
	},

	willDestroyElement() {
		$(window).off('scroll', this.onScrollHandler);
	},

	actions: {
		/**
		 * FIXME FEATURED VIDEO A/B TEST ONLY
		 */
		dismissPlayer() {
			this.$().removeClass(scrollClassName).addClass('is-dismissed');

			this.player.setMute(true);
			this.track(trackActions.click, 'onscroll-close');

			document.body.classList.remove('featured-video-on-scroll-active');

			$(window).off('scroll', this.onScrollHandler);
		}
	},

	/**
	 * @param {Object} player
	 * @returns {void}
	 */
	onCreate(player) {
		let playerWasOnceInViewport = false;

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

		this.player.on('play', ({playReason}) => {
			if (playReason === 'interaction' && this.$().hasClass(scrollClassName)) {
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

	/**
	 * FIXME FEATURED VIDEO A/B TEST ONLY
	 */
	onScrollHandler() {
		const currentScrollPosition = window.pageYOffset,
			requiredScrollDelimiter = this.getRequiredScrollDelimiter(),
			hasScrollClass = this.$().hasClass(scrollClassName);

		if (currentScrollPosition >= requiredScrollDelimiter && !hasScrollClass) {
			this.$().addClass(scrollClassName);
			this.track(trackActions.impression, 'onscroll');
		} else if (currentScrollPosition < requiredScrollDelimiter && hasScrollClass) {
			this.$().removeClass(scrollClassName);
		}
	},

	/**
	 * Gets number indicating when video should start floating
	 *
	 * @return {number}
	 */
	getRequiredScrollDelimiter() {
		const compensation = 0;

		return this.$().offset().top - compensation;
	},

	setPlaceholderDimensions() {
		const placeHolder = this.$('.article-featured-video__on-scroll-placeholder')[0],
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
