import {BasePlayer} from 'VideoPlayers/Base';
import {OoyalaPlayer} from 'VideoPlayers/Ooyala';
import {YouTubePlayer} from 'VideoPlayers/YouTube';

const playerClassMap = {
	base: BasePlayer,
	ooyala: OoyalaPlayer,
	youtube: YouTubePlayer
};

export class VideoLoader {
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
			params = $.extend(this.data.jsParams, {
				size: {
					height: this.data.height,
					width: this.data.width
				}
			});

		this.player = new playerClassMap[provider](provider, params);
		this.player.onResize();
	}

	/**
	 * @returns {string}
	 */
	getProviderName() {
		return this.isProvider('ooyala') ? 'ooyala' : this.data.provider || 'base';
	}

	/**
	 * @returns {void}
	 */
	onResize() {
		this.player.onResize();
	}
}
