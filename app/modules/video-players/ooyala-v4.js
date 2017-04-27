import BasePlayer from './base';
import config from '../../config/environment';

export default class OoyalaV4Player extends BasePlayer {
	/**
	 * @param {string} provider
	 * @param {*} params
	 * @returns {void}
	 */
	constructor(provider, params) {
		const ooyalaPCode = config.ooyala.pcode;
		const ooyalaPlayerBrandingId = config.ooyala.playerBrandingId;
		const skinConfigUrl = `/wikia.php?controller=OoyalaConfig&method=skin&cb=${params.cacheBuster}`;

		params.pcode = ooyalaPCode;
		params.playerBrandingId = ooyalaPlayerBrandingId;
		params.skin = {
			config: skinConfigUrl
		};

		super(provider, params);

		this.containerId = params.containerId;
	}

	/**
	 * @returns {void}
	 */
	setupPlayer() {
		if (!window.OO) {
			console.error('Ooyala player has not been loaded.');
		} else {
			this.createPlayer();
		}
	}

	/**
	 * @returns {void}
	 */
	createPlayer() {
		window.OO.ready(() => {
			window.OO.Player.create(this.containerId, this.params.videoId, this.params);
		});
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}
