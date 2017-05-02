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
		const skinConfigUrl = `/wikia.php?controller=OoyalaConfig&method=skin&isMobile=1&cb=${params.cacheBuster}`;

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
			this.loadPlayer();
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
	 * @return {void}
	 */
	loadPlayer() {
		this.loadStyles(config.ooyala.styles);
		this.loadScripts(config.ooyala.script, this.playerDidLoad.bind(this));
	}

	loadStyles(cssFiles) {
		const html = cssFiles.map((url) => {
			return `<link rel="stylesheet" href="${url}" crossorigin="anonymous">`;
		}).join('');

		$(html).appendTo('head');
	}

	loadScripts(jsFile, callback) {
		$script(jsFile, () => {
			callback();
		});
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}
