/// <reference path="../../../baseline/Wikia.d.ts" />
/// <reference path="./Base.ts" />

interface Window {
	OO: {
		Player: {
			create: (
				 container: string,
				 videoId: string,
				 params: any
				 ) => void
		};
		EVENTS: any
	}
}

module Wikia.Modules.VideoPlayer {

	export class OoyalaPlayer extends BasePlayer {
		started: boolean;
		ended: boolean;
		constructor (provider: string, params: any) {
			super(provider, params);
			this.started = false;
			this.ended = false;
			this.setupPlayer();
		}

		// a bit ambiguous based on legacy return, but the first file is the
		// Ooyala embedded API, the second is AgeGate
		public resourceURI = this.params.jsFile[0];
		// Ooyala JSON payload contains a DOM id
		public containerId = this.createUniqueId(this.params.playerId);

		setupPlayer (): void {

			this.params = $.extend(this.params, {
				onCreate: () => { return this.onCreate.apply(this, arguments) }
			});

			if (!window.OO) {
				this.loadPlayer();
			} else {
				this.createPlayer();
			}
		}

		createPlayer (): void {
			window.OO.Player.create(this.containerId, this.params.videoId, this.params);
		}

		playerDidLoad (): void {
			this.createPlayer();
		}

		onCreate (player: any): void {
			var messageBus = player.mb;

			// Player has loaded
			messageBus.subscribe(window.OO.EVENTS.PLAYER_CREATED, 'tracking', () => {
				this.track('player-load');
			});

			// Actual content starts playing (past any ads or age-gates)
			messageBus.subscribe(window.OO.EVENTS.PLAYING, 'tracking', () => {
				if (!this.started) {
					this.track('content-begin');
					this.started = true;
				}

			});

			// Ad starts
			messageBus.subscribe(window.OO.EVENTS.WILL_PLAY_ADS, 'tracking', () => {
				this.track('ad-start');
			});

			// Ad has been fully watched
			messageBus.subscribe(window.OO.EVENTS.ADS_PLAYED, 'tracking', () => {
				this.track('ad-finish');
			});

			// Listen GoogleIma event to fill adTagUrl for no-flash scenario
			// messageBus.subscribe('googleImaReady', 'tracking', function () {
			// 	var i;
			// 	if (player && player.modules && player.modules.length) {
			// 		for (i = 0; i < player.modules.length; i = i + 1) {
			// 			if (player.modules[i].name === "GoogleIma" && player.modules[i].instance) {
			// 				player.modules[i].instance.adTagUrl = tagUrl;
			// 			}
			// 		}
			// 	}
			// });
		}
	}
}

