import BasePlayer from './Base';

/**
 * @typedef {Object} YouTubeEvent
 * @property {number} data
 * @property {*} target
 */

export default class YouTubePlayer extends BasePlayer {
	/**
	 * @param {string} provider
	 * @param {*} params
	 * @returns {void}
	 */
	constructor(provider, params) {
		super(provider, params);
		this.started = false;
		this.ended = false;

		this.resourceURI = 'https://www.youtube.com/iframe_api';
		this.containerId = BasePlayer.createUniqueId('youtubeVideoPlayer');

		this.bindPlayerEvents();
	}

	/**
	 * @returns {void}
	 */
	bindPlayerEvents() {
		this.params.events = {
			onReady: (...args) => {
				return this.onPlayerReady.apply(this, args);
			},
			onStateChange: (...args) => {
				return this.onPlayerStateChange.apply(this, args);
			}
		};

		if (window.YT) {
			this.createPlayer();
		} else {
			window.onYouTubeIframeAPIReady = () => {
				this.createPlayer();
			};
			this.loadPlayer();
		}
	}

	/**
	 * @returns {void}
	 */
	createPlayer() {
		this.player = new window.YT.Player(this.containerId, this.params);
	}

	/**
	 * @returns {void}
	 */
	onPlayerReady() {
		this.onResize();
		this.track('player-loaded');
	}

	/**
	 * @param {YouTubeEvent} event
	 * @returns {void}
	 */
	onPlayerStateChange(event) {
		if (!this.started && event.data === 1) {
			this.track('content-begin');
			this.started = true;
		}

		if (!this.ended && event.data === 0) {
			this.track('content-end');
			this.ended = true;
		}
	}
}
