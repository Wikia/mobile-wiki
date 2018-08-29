import getAdsModule from '../ads';
import BasePlayer from './base';
import JWPlayerVideoAds from './jwplayer-video-ads';
import { track } from '../../utils/track';
import config from '../../config/environment';
import JWPlayerAssets from '../jwplayer-assets';
import { inGroup } from '../abtest';

export default class JWPlayer extends BasePlayer {
  constructor(provider, params) {
    const originalOnCreate = params.onCreate;

    super(provider, params);
    this.recommendedVideoPlaylist = params.recommendedVideoPlaylist || 'Y2RWCKuS';
    this.videoTags = params.videoTags || '';

    params.onCreate = (bidParams, player) => {
      M.trackingQueue.push(() => {
        getAdsModule()
          .then((adsModule) => {
            originalOnCreate(player);
            adsModule.initJWPlayer(player, bidParams, this.getSlotTargeting());
          });
      });
    };

    this.adTrackingParams = params.adTrackingParams || {};
  }

  getSlotTargeting() {
    return {
      plist: this.recommendedVideoPlaylist,
      vtags: this.videoTags,
    };
  }

  setupPlayer() {
    if (!window.wikiaJWPlayer) {
      this.loadPlayer();
    } else {
      this.createPlayer();
    }
  }

  /**
  * @returns {void}
  */
  createPlayer() {
    getAdsModule().then((adsModule) => {
      adsModule
        .waitForReady()
        .then(() => (new JWPlayerVideoAds(this.params)).getConfig())
        .then(bidParams => this.initializePlayer(adsModule, bidParams));
    });
  }

  initializePlayer(adsModule, bidParams) {
    const containerId = this.params.containerId;
    const initialPath = window.location.pathname;
    const isForcedClickToPlay = adsModule && adsModule.adContextModule
      ? adsModule.adContextModule.get('rabbits.ctpMobile') : false;

    if (!document.getElementById(containerId)) {
      return;
    }

    // Check whether autoplay is disabled by AdEng experiment
    // It's handled here because we need to have properly configured adContext
    this.params.autoplay = !isForcedClickToPlay && this.params.autoplay;

    window.wikiaJWPlayer(
      containerId,
      {
        tracking: {
          track(data) {
            const path = window.location.pathname;

            data.trackingMethod = 'both';

            /**
       * this function is called by a third party lib (jwplayer) asynchrounosly
       * if video player is not in DOM - probably user navigated to another page
       * do not call tracking function in such case
       */
            if (document.getElementById(containerId) && path === initialPath) {
              track(data);
            }
          },
          setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
          comscore: config.environment === 'production',
        },
        settings: {
          showAutoplayToggle: !isForcedClickToPlay && !inGroup('FV_CLICK_TO_PLAY', 'CLICK_TO_PLAY'),
          showCaptions: true,
        },
        sharing: true,
        selectedCaptionsLanguage: this.params.selectedCaptionsLanguage,
        autoplay: this.params.autoplay,
        mute: this.params.autoplay,
        related: {
          time: 3,
          playlistId: this.recommendedVideoPlaylist,
          autoplay: true,
        },
        videoDetails: {
          description: this.params.playlist[0].description,
          title: this.params.playlist[0].title,
          playlist: this.params.playlist,
        },
        logger: {
          clientName: 'mobile-wiki',
          clientVersion: config.APP.version,
        },
        lang: this.params.lang,
      },
      this.params.onCreate.bind(this, bidParams),
    );

    getAdsModule().then(adsModule => adsModule.jwPlayerMoat.loadTrackingPlugin());
  }

  /**
  * @return {void}
  */
  loadPlayer() {
    JWPlayerAssets.load().then(() => {
      this.playerDidLoad();
    });
  }

  /**
  * @returns {void}
  */
  playerDidLoad() {
    this.createPlayer();
  }
}
