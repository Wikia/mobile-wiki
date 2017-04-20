import BasePlayer from './base';

export default class OoyalaV4Player extends BasePlayer {
	/**
	 * @param {string} provider
	 * @param {*} params
	 * @returns {void}
	 */
	constructor(provider, params) {
		params.pcode = 'J0MTUxOtPDJVNZastij14_v7VDRS';
		params.playerBrandingId = '6d79ed36a62a4a9885d9c961c70289a8';

		params.skin = {
			config: '/wikia.php?controller=OoyalaConfig&method=skin'
		};
		super(provider, params);

		this.resourceURI = '/mobile-wiki/assets/ooyala.js';
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
		if (this.created) {
			return;
		}
		this.created = true;
		window.OO.ready(() => {
			window.OO.Player.create('asdasd', this.params.videoId, this.params);
		});
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}
}
