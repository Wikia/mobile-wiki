/// <reference path="../../../baseline/mercury.d.ts" />
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

module Mercury.Modules.VideoPlayers {

	export class OoyalaPlayer extends BasePlayer {
		started: boolean;
		ended: boolean;
		constructor (provider: string, params: any) {
			super(provider, params);
			this.started = false;
			this.ended = false;
			this.setupContainer();
			this.setupPlayer();
		}

		// a bit ambiguous based on legacy return, but the first file is the
		// Ooyala embedded API, the second is AgeGate
		public resourceURI = this.params.jsFile[0];
		// Ooyala JSON payload contains a DOM id
		public containerId = this.createUniqueId(this.params.playerId);

		setupContainer (): void {
			var onResize = () => {
				this.resizeContainer();
			};
			$(window).on('resize', onResize);

			this.resizeContainer();
		}

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
		}

		/**
		 * Sets CSS width and height for the video container.
		 * They're calculated basing on lightbox's dimensions and video's aspect ratio.
		 */
		resizeContainer (): void {
			var $container: any = $('#' + this.containerId),
				$lightbox: any = $('.lightbox-wrapper'),
				videoWidth: number = this.params.size.width,
				videoHeight: number = this.params.size.height,
				lightboxWidth: number = $lightbox.width(),
				lightboxHeight: number = $lightbox.height(),
				targetWidth: number,
				targetHeight: number;

			if (lightboxWidth < lightboxHeight) {
				targetWidth = lightboxWidth;
				targetHeight = Math.min(lightboxHeight, ~~(lightboxWidth * videoHeight / videoWidth));
			} else {
				targetWidth = Math.min(lightboxWidth, ~~(lightboxHeight * videoWidth / videoHeight));
				targetHeight = lightboxHeight;
			}

			$container.css({
				width: targetWidth,
				height: targetHeight
			});
		}
	}
}

