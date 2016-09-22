import Ads from '../ads';
import BasePlayer from './base';
import {trackActions} from '../../utils/track';

export default class OoyalaPlayer extends BasePlayer {
	/**
	 * @param {string} provider
	 * @param {*} params
	 * @returns {void}
	 */
	constructor(provider, params) {
		super(provider, params);

		this.started = false;
		this.ended = false;

		// a bit ambiguous based on legacy return, but the first file is the
		// Ooyala embedded API, the second is AgeGate
		this.resourceURI = params.jsFile[0];

		// Ooyala JSON payload contains a DOM id
		this.containerId = BasePlayer.createUniqueId(params.playerId);
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
		Ads.getInstance().onReady(function () {
			const vastUrl = Ads.getInstance().buildVastUrl();

			this.params.onCreate = (...args) => {
				return this.onCreate.apply(this, args);
			};

			if (!this.params.noAds) {
				this.params['google-ima-ads-manager'] = {
					adTagUrl: vastUrl
				};
			}

			window.OO.Player.create(this.containerId, this.params.videoId, this.params);
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
