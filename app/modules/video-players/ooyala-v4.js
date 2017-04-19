import Ads from '../ads';
import BasePlayer from './base';
import {trackActions} from '../../utils/track';

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

		this.started = false;
		this.ended = false;

		this.resourceURI = [
			'http://harrypotter.wikia.com/extensions/wikia/ArticleVideo/scripts/ooyala/core.js',
			'http://harrypotter.wikia.com/extensions/wikia/ArticleVideo/scripts/ooyala/main_html5.js',
			'http://harrypotter.wikia.com/extensions/wikia/ArticleVideo/scripts/ooyala/html5-skin.js'
		];

		// Ooyala JSON payload contains a DOM id
		this.containerId = BasePlayer.createUniqueId(params.playerBrandingId);
		this.containerSelector = `#${this.containerId}`;
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
		Ads.getInstance().onReady(function () {
			const size = this.params.size || {},
				vastUrl = Ads.getInstance().buildVastUrl(size.width / size.height, {
					passback: 'ooyala',
					pos: 'ooyala',
					src: 'gpt'
				});

			this.params.onCreate = (...args) => {
				return this.onCreate.apply(this, args);
			};

			if (!this.params.noAds) {
				this.params['google-ima-ads-manager'] = {
					adTagUrl: vastUrl
				};
			}
			window.OO.Player.create( 'asdasd', this.params.videoId, this.params);
		}, this);
	}

	/**
	 * @returns {void}
	 */
	playerDidLoad() {
		this.createPlayer();
	}

	/**
	 * @param {*} player
	 * @returns {void}
	 */
	onCreate(player) {
		const messageBus = player.mb;

		// Player has loaded
		messageBus.subscribe(window.OO.EVENTS.PLAYER_CREATED, 'tracking', () => {
			this.track(trackActions.success, 'player-load');
		});

		// Actual content starts playing (past any ads or age-gates)
		messageBus.subscribe(window.OO.EVENTS.PLAYING, 'tracking', () => {
			if (!this.started) {
				this.track(trackActions.playVideo, 'content-begin');
				this.started = true;
			}
		});

		// Ad starts
		messageBus.subscribe(window.OO.EVENTS.WILL_PLAY_ADS, 'tracking', () => {
			this.track(trackActions.view, 'ad-start');
		});

		// Ad has been fully watched
		messageBus.subscribe(window.OO.EVENTS.ADS_PLAYED, 'tracking', () => {
			this.track(trackActions.success, 'ad-finish');
		});
	}
}
