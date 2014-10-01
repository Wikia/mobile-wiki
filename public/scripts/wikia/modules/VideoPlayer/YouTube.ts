/// <reference path="../../../baseline/Wikia.d.ts" />
/// <reference path="./Base.ts" />

interface Window {
	YT: {
		    Player: (id: string, params: any) => void;
	    };
	onYouTubeIframeAPIReady: () => void;
}

interface YouTubeEvent {
	data: number;
	target: any;
}

module Wikia.Modules.VideoPlayer {
	export class YouTubePlayer extends BasePlayer {
		started: boolean;
		ended: boolean;

		constructor (provider: string, params: any) {
			super(provider, params);
			this.started = false;
			this.ended = false;
			this.bindPlayerEvents();
		}

		public resourceURI = 'https://www.youtube.com/iframe_api';
		public containerId = this.createUniqueId('youtubeVideoPlayer');

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

		createPlayer (): void {
			this.player = new window.YT.Player(this.containerId, this.params);
		}

		onPlayerReady (): void {
			this.track('player-loaded');
		}

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

