/// <reference path="../../../../baseline/Wikia.d.ts" />
/// <reference path="./Base.ts" />

interface Window {
	YT: {
		    Player: (id: string, params: any) => void;
	    };
	onYouTubeIframeAPIReady: () => void;
}

module Wikia.Modules.VideoLoader.Player {
	export class YouTubePlayer extends BasePlayer {
		started: boolean;
		ended: boolean;

		constructor (params) {
			super(params);
			this.started = false;
			this.ended = false;
			this.bindPlayerEvents();
		}

		public resourceURI = 'https://www.youtube.com/iframe_api';
		public containerId = this.createUniqueId('youtubeVideoPlayer');

		bindPlayerEvents (): void {
			this.params.events = {
				'onReady': this.onPlayerReady,
				'onStateChange': this.onPlayerStateChange
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
			/* tracking */
		}

		onPlayerStateChange (): void {
		}

	}
}

