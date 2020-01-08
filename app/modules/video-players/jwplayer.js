import { Communicator } from '@wikia/post-quecast';
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
    this.videoScope = params.isDedicatedForArticle ? 'article' : 'wiki';
    this.communicator = new Communicator();

    this.videoTags = params.videoTags || '';
    this.videoOptions = null;

    params.onCreate = (player) => {
      M.trackingQueue.push(() => {
        originalOnCreate(player);
        this.dispatchPlayerReady(player);
      });
    };

    this.adTrackingParams = params.adTrackingParams || {};
  }

  dispatchPlayerReady(player) {
    if (this.videoOptions) {
      const playerKey = 'aeJWPlayerKey';

      window[playerKey] = player;

      this.communicator.dispatch({
        type: '[JWPlayer] Player Ready',
        options: this.videoOptions,
        targeting: this.getSlotTargeting(),
        playerKey,
      });
    }
  }

  getSlotTargeting() {
    return {
      plist: this.recommendedVideoPlaylist,
      vtags: this.videoTags,
      videoScope: this.videoScope,
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
    Ads.getLoadedInstance()
      .then((ads) => {
        ads.waitForVideoBidders()
          .then(() => this.initializePlayer());
      })
      .catch(() => {
        // Ads not loaded
        this.initializePlayer();
      });
  }

  initializePlayer() {
    const containerId = this.params.containerId;
    const initialPath = window.location.pathname;
    const videoScope = this.params.isDedicatedForArticle ? 'article' : 'wiki';

    if (!document.getElementById(containerId)) {
      return;
    }

    this.videoOptions = {
      audio: !this.params.autoplay,
      autoplay: this.params.autoplay,
      featured: true,
      videoId: this.params.playlist[0].mediaid,
    };

    M.tracker.UniversalAnalytics.setDimension(30, videoScope);

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
              track(Object.assign(data, { videoScope }));
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
