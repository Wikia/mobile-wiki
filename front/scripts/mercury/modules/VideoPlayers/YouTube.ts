/// <reference path="../../../baseline/mercury.d.ts" />
/// <reference path="./Base.ts" />

interface YouTubePlayer {
	new(id: string, params: any): any;
}

interface Window {
	YT: {
		Player: YouTubePlayer
	};
	onYouTubeIframeAPIReady: () => void;
}

interface YouTubeEvent {
	data: number;
	target: any;
}

/**
 * @typedef {object} YouTubeEvent
 * @property {number} data
 * @property {any} target
 */

module Mercury.Modules.VideoPlayers {
	export class YouTubePlayer extends BasePlayer {
		started: boolean;
		ended: boolean;

		/**
		 * @param {string} provider
		 * @param {*} params
		 * @returns {undefined}
		 */
		constructor (provider: string, params: any) {
			super(provider, params);
			this.started = false;
			this.ended = false;
			this.bindPlayerEvents();
		}

		resourceURI = 'https://www.youtube.com/iframe_api';
		containerId = this.createUniqueId('youtubeVideoPlayer');

		/**
		 * @returns {undefined}
		 */
		bindPlayerEvents (): void {
			this.params.events = {
				'onReady': () => { return this.onPlayerReady.apply(this, arguments); },
				'onStateChange': () => { return this.onPlayerStateChange.apply(this, arguments); }
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
		 * @returns {undefined}
		 */
		createPlayer (): void {
			this.player = new window.YT.Player(this.containerId, this.params);
		}

		/**
		 * @returns {undefined}
		 */
		onPlayerReady (): void {
			this.onResize();
			this.track('player-loaded');
		}

		/**
		 * @param {YouTubeEvent} event
		 * @returns {undefined}
		 */
		onPlayerStateChange (event: YouTubeEvent): void {
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
}

