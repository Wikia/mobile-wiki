import BasePlayer from './video-players/base';
import YouTubePlayer from './video-players/youtube';
import JWPlayer from './video-players/jwplayer';

const playerClassMap = {
  base: BasePlayer,
  youtube: YouTubePlayer,
  jwplayer: JWPlayer,
};

/**
  * @class VideoLoader
  */
export default class VideoLoader {
  /**
  * @param {*} data
  * @param noAds bool
  * @returns {void}
  */
  constructor(data, noAds = false) {
    data.noAds = noAds;
    this.data = data;
  }

  /**
  * Loads player for the video, currently either YouTubePlayer or BasePlayer (default)
  *
  * @returns {void}
  */
  loadPlayerClass() {
    const provider = this.getProviderName();
    const PlayerClass = playerClassMap[provider] || playerClassMap.base;
    const params = Object.assign({}, this.data.jsParams, {
      /* eslint ember/avoid-leaking-state-in-ember-objects:0 */
      size: {
        height: this.data.height,
        width: this.data.width,
      },
      noAds: this.data.noAds,
    });

    this.player = new PlayerClass(provider, params);
    this.player.setupPlayer();
    this.player.onResize();
  }

  /**
  * @returns {string}
  */
  getProviderName() {
    return this.data.provider;
  }

  /**
  * @returns {void}
  */
  onResize() {
    this.player.onResize();
  }
}
