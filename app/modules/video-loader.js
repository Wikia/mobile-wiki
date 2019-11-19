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
    const PlayerClass = VideoLoader.getPlayerClassBasedOnProvider(provider);
    const params = Object.assign({}, this.data.jsParams, {
      /* eslint ember/avoid-leaking-state-in-ember-objects:0 */
      size: {
        height: this.data.height,
        width: this.data.width,
      },
      noAds: this.data.noAds,
      isDedicatedForArticle: this.data.isDedicatedForArticle,
    });

    this.player = VideoLoader.createPlayer(PlayerClass, provider, params);
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

  /**
  * Creates instance of given class
  *
  * @param {string} PlayerClass
  * @param {string} provider
  * @param {Object} params
  * @returns {BasePlayer|YouTubePlayer}
  */
  static createPlayer(PlayerClass, provider, params) {
    return new PlayerClass(provider, params);
  }

  /**
  * @param {string} provider
  * @returns {class}
  */
  static getPlayerClassBasedOnProvider(provider) {
    if (playerClassMap[provider]) {
      return playerClassMap[provider];
    }
    return playerClassMap.base;
  }
}
