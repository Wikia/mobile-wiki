import Ads from '../ads';
import BasePlayer from './base';
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
    this.videoAds = null;

    params.onCreate = (player) => {
      M.trackingQueue.push(() => {
        originalOnCreate(player);

        if (this.videoAds) {
          this.videoAds.register(player, this.getSlotTargeting());
        }
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
    const ads = Ads.getInstance();

    ads.waitForReady()
      .then(() => ads.waitForVideoBidders())
      .then(() => this.initializePlayer(ads));
  }

  initializePlayer(ads) {
    const containerId = this.params.containerId;
    const initialPath = window.location.pathname;

    if (!document.getElementById(containerId)) {
      return;
    }

    this.videoAds = ads.createJWPlayerVideoAds({
      audio: !this.params.autoplay,
      autoplay: this.params.autoplay,
      featured: true,
      videoId: this.params.playlist[0].mediaid,
    });

    window.wikiaJWPlayer(
      containerId,
      {
        tracking: {
          track(data) {
            const path = window.location.pathname;

            data.trackingMethod = 'both';

            /*
             this function is called by a third party lib (jwplayer) asynchrounosly
             if video player is not in DOM - probably user navigated to another page
             do not call tracking function in such case
            */
            if (document.getElementById(containerId) && path === initialPath) {
              track(data);
            }
          },
          setCustomDimension: M.tracker.UniversalAnalytics.setDimension,
          comscore: config.environment === 'production',
        },
        settings: {
          showAutoplayToggle: !inGroup('FV_CLICK_TO_PLAY', 'CLICK_TO_PLAY'),
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
      this.params.onCreate.bind(this),
    );

    ads.loadJwplayerMoatTracking();
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
