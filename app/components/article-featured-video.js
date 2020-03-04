import Component from '@ember/component';
import { computed } from '@ember/object';
import {
  and, oneWay, readOnly, reads,
} from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import JWPlayerMixin from '../mixins/jwplayer';
import VideoLoader from '../modules/video-loader';
import duration from '../utils/duration';
import extend from '../utils/extend';
import { transparentImageBase64 } from '../utils/thumbnail';
import { track, trackActions } from '../utils/track';
import { logError } from '../modules/event-logger';

export default Component.extend(JWPlayerMixin, RespondsToScroll, {
  ads: service('ads/ads'),
  logger: service(),
  video: service(),
  wikiVariables: service(),
  runtimeConfig: service(),

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

    if (this.currentVideoDetails === this.initialVideoDetails) {
      return duration(currentVideoDuration);
    }

    return currentVideoDuration;
  }),

  placeholderStyle: computed('placeholderImage', function () {
    return htmlSafe(`background-image: url(${this.placeholderImage})`);
  }),

  init() {
    this._super(...arguments);

    this.set('videoContainerId', `jwplayer-article-video-${new Date().getTime()}`);
  },

  didInsertElement() {
    this._super(...arguments);

    M.trackingQueue.push(() => {
      this.destroyVideoPlayer();
      this.initVideoPlayer();
    });

    if (this.hasAttribution) {
      this.set('attributionAvatarUrl', this.get('currentVideoDetails.userAvatarUrl'));
    }

    this.set('onScrollVideoWrapper', this.element.querySelector('.article-featured-video__on-scroll-video-wrapper'));

    this.setPlaceholderDimensions();
    window.addEventListener('orientationchange', () => {
      if (this.isInLandscapeMode()) {
        this.onScrollStateChange('inactive');
      }
    });
    document.body.classList.add(this.bodyOnScrollActiveClass);
  },

  didUpdateAttrs() {
    this.destroyVideoPlayer();
    this.initVideoPlayer();
  },

  willDestroyElement() {
    document.body.classList.remove(this.bodyOnScrollActiveClass);
    this.destroyVideoPlayer();
  },

  actions: {
    dismissPlayer() {
      this.set('isOnScrollClosed', true);
      this.onScrollStateChange('closed');

      if (this.player) {
        this.player.setMute(true);
        this.player.pause();
      }
      document.body.classList.remove(this.bodyOnScrollActiveClass);

      // this.scrollHandler is from ember-responds-to - there is no public API to
      // remove a scroll handler now
      window.removeEventListener('scroll', this.scrollHandler);
    },

    clickAttribution() {
      track({
        action: trackActions.click,
        category: 'featured-video',
        label: this.get('currentVideoDetails.username'),
      });
    },
  },

  /**
   * @param {Object} player
   * @returns {void}
   */
  onCreate(player) {
    this.player = player;

    this.player.on('autoplayToggle', ({ enabled }) => {
      this.setCookie(this.autoplayCookieName, (enabled ? '1' : '0'), this.runtimeConfig.cookieDomain);
    });

    this.player.on('captionsSelected', ({ selectedLang }) => {
      this.setCookie(this.captionsCookieName, selectedLang, this.runtimeConfig.cookieDomain);
    });

    this.player.on('relatedVideoPlay', ({ item }) => {
      this.set('currentVideoDetails', item);
    });

    // this is a hack to fix pause/play issue
    // while scrolling down and on scroll is active on iOS 10.3.2
    this.player.on('pause', ({ pauseReason, viewable }) => {
      if (pauseReason === 'autostart' && viewable === 0 && this.isOnScrollActive) {
        this.player.play();
      }
    });

    this.player.on('adPause', ({ viewable }) => {
      if (viewable === 0 && this.isOnScrollActive) {
        this.player.play();
      }
    });

    this.player.on('adError', (error) => {
      logError(this.runtimeConfig.servicesExternalHost, 'JWPlayer adError', error);
    });

    // to make sure custom dimension is set and tracking event is sent
    let onScrollState = this.isOnScrollActive ? 'active' : 'inactive';
    if (this.isOnScrollClosed) {
      onScrollState = 'closed';
    }
    this.onScrollStateChange(onScrollState);

    if (!this.get('model.isDedicatedForArticle')) {
      this.setVideoSeenInSession();
    }

    this.resizeVideo = this.resizeVideo.bind(this);
    this.onScrollVideoWrapper.addEventListener('transitionend', this.resizeVideo);
  },

  /**
   * @returns {void}
   */
  initVideoPlayer() {
    if (!window.canPlayVideo(true)) {
      document.body.classList.add('no-featured-video');
      this.video.set('hasFeaturedVideo', false);

      return;
    }

    document.body.classList.remove('no-featured-video');
    this.video.set('hasFeaturedVideo', true);

    const model = this.get('model.embed');
    const jsParams = {
      autoplay: window.Cookies.get(this.autoplayCookieName) !== '0',
      selectedCaptionsLanguage: window.Cookies.get(this.captionsCookieName),
      adTrackingParams: {
        adProduct: this.get('ads.noAds') ? 'featured-video-no-preroll' : 'featured-video-preroll',
        slotName: 'FEATURED',
      },
      containerId: this.videoContainerId,
      noAds: this.get('ads.noAds'),
      onCreate: this.onCreate.bind(this),
      lang: this.get('wikiVariables.language.content'),
      isDedicatedForArticle: this.get('model.isDedicatedForArticle'),
      playlist: this.getModifiedPlaylist(model.jsParams.playlist, this.get('model.isDedicatedForArticle')),
    };
    const data = extend({}, model, {
      jsParams,
    });
    const videoLoader = new VideoLoader(data);

    videoLoader.loadPlayerClass();
  },

  /**
   * @returns {void}
   */
  destroyVideoPlayer() {
    if (this.player) {
      // FIXME this is temporary solution
      // to fix nested glimmer transaction exception which causes application break
      // more info in XW-4600
      try {
        this.player.remove();
      } catch (e) {
        this.logger.warn(e);
      }
    }
  },

  setCookie(cookieName, cookieValue, domain) {
    window.Cookies.set(cookieName, cookieValue, {
      domain,
      expires: this.playerCookieExpireDays,
      path: '/',
    });
  },

  setVideoSeenInSession() {
    if (!this.hasSeenTheVideoInCurrentSession()) {
      const currentSession = window.Cookies.get('wikia_session_id');

      this.setCookie(this.videoSeenInSessionCookieName, currentSession);
      this.setCookie('playerImpressionsInSession', 1);
    } else {
      this.setCookie('playerImpressionsInSession', this.getPlayerImpressionsInSession() + 1);
    }
  },

  getModifiedPlaylist(playlist, isDedicatedForArticle) {
    const normalizedPlaylistIndex = this.getNormalizedPlaylistIndex(playlist);
    const newPlaylist = playlist.slice(normalizedPlaylistIndex);

    return (!isDedicatedForArticle && newPlaylist.length) ? newPlaylist : playlist;
  },

  getNormalizedPlaylistIndex(playlist) {
    const impressions = this.getPlayerImpressionsInSession();

    return impressions > playlist.length ? impressions % playlist.length : impressions;
  },

  hasSeenTheVideoInCurrentSession() {
    return window.Cookies.get('wikia_session_id') === window.Cookies.get(this.videoSeenInSessionCookieName);
  },

  getPlayerImpressionsInSession() {
    if (!this.hasSeenTheVideoInCurrentSession()) {
      return 0;
    }

    return Number(window.Cookies.get('playerImpressionsInSession'));
  },

  resizeVideo() {
    this.player.resize();
  },

  scroll() {
    if (!this.element) {
      return;
    }

    const currentScrollPosition = window.pageYOffset;
    const globalNavigationElement = document.querySelector('.wds-global-navigation');
    const globalNavigationHeight = globalNavigationElement
      ? globalNavigationElement.offsetHeight : 0;
    const requiredScrollDelimiter = this.element.getBoundingClientRect().top
      + window.scrollY - globalNavigationHeight;
    const isOnScrollActive = this.isOnScrollActive;
    const isInLandscapeMode = this.isInLandscapeMode();

    if (!isInLandscapeMode) {
      if (currentScrollPosition >= requiredScrollDelimiter && !isOnScrollActive) {
        this.onScrollStateChange('active');
      } else if (currentScrollPosition < requiredScrollDelimiter && isOnScrollActive) {
        this.onScrollStateChange('inactive');
      }
    }
  },

  setPlaceholderDimensions() {
    const placeHolder = this.element.querySelector('.article-featured-video__on-scroll-placeholder');
    const videoContainer = this.element.children[0];

    placeHolder.style.height = `${videoContainer.offsetHeight}px`;
    placeHolder.style.width = `${videoContainer.offsetWidth}px`;
  },

  onScrollStateChange(state) {
    this.set('isOnScrollActive', state === 'active');
    if (this.player) {
      this.player.trigger('onScrollStateChanged', { state });
    }
  },

  isInLandscapeMode() {
    return Math.abs(window.orientation) === 90;
  },
});
