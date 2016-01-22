import BasePlayer from './VideoPlayers/Base';
import OoyalaPlayer from './VideoPlayers/Ooyala';
import YouTubePlayer from './VideoPlayers/YouTube';

const playerClassMap = {
	base: BasePlayer,
	ooyala: OoyalaPlayer,
	youtube: YouTubePlayer
};

/**
 * @class VideoLoader
 */
export default class VideoLoader {
	/**
	 * @param {*} data
	 * @returns {void}
	 */
	constructor(data) {
		this.data = data;
		this.loadPlayerClass();
	}

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	isProvider(name) {
		return Boolean(this.data.provider.toLowerCase().match(name));
	}

	/**
	 * Loads player for the video, currently either OoyalaPlayer, YouTubePlayer or BasePlayer (default)
	 *
	 * @returns {void}
	 */
	loadPlayerClass() {
		const provider = this.getProviderName(),
			playerClass = VideoLoader.getPlayerClassBasedOnProvider(provider),
			params = $.extend(this.data.jsParams, {
				size: {
					height: this.data.height,
					width: this.data.width
				}
			});

		this.player = VideoLoader.createPlayer(playerClass, provider, params);
		this.player.setupPlayer();
		this.player.onResize();
	}

	/**
	 * @returns {string}
	 */
	getProviderName() {
		return this.isProvider('ooyala') ? 'ooyala' : this.data.provider;
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
	 * @param {string} playerClass
	 * @param {string} provider
	 * @param {Object} params
	 * @returns {*}
	 */
	static createPlayer(playerClass, provider, params) {
		return new playerClass(provider, params);
	}

	/**
	 * @param {string} provider
	 * @returns {class}
	 */
	static getPlayerClassBasedOnProvider(provider) {
		if (playerClassMap.hasOwnProperty(provider)) {
			return playerClassMap[provider];
		} else {
			return playerClassMap.base;
		}
	}
}
