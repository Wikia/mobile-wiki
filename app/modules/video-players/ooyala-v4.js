import BasePlayer from './base';

export default class OoyalaV4Player extends BasePlayer {
	/**
	 * @param {string} provider
	 * @param {*} params
	 * @returns {void}
	 */
	constructor(provider, params, containerId) {
		const ooyalaPCode = 'J0MTUxOtPDJVNZastij14_v7VDRS';
		const ooyalaPlayerBrandingId = '6d79ed36a62a4a9885d9c961c70289a8';
		const ooyalaJs = '/mobile-wiki/assets/ooyala/all.js';
		const skinConfigUrl = '/wikia.php?controller=OoyalaConfig&method=skin&cb=' + M.getFromShoebox('wikiVariables').cacheBuster;

		params.pcode = ooyalaPCode;
		params.playerBrandingId = ooyalaPlayerBrandingId;
		params.skin = {
			config: skinConfigUrl
		};

		super(provider, params);

		this.resourceURI = ooyalaJs;
		this.containerId = containerId;
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
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}
