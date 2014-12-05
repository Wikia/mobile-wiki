/// <reference path="../../../baseline/mercury.d.ts" />
/// <reference path="../../utils/track.ts" />
/// <reference path="../../utils/load.ts" />

module Mercury.Modules.VideoPlayers {
	export class BasePlayer {
		player: any;
		params: any;
		id: string;
		provider: string;
		resourceURI: string;

		constructor (provider: string, params: any) {
			if (!provider) {
				throw new Error('VideoPlayer requires a provider as the first argument');
			}
			this.provider = provider;
			this.params = params;
			this.id = params.videoId;
			this.onResize();
		}

		loadPlayer () {
			return M.load(this.resourceURI, () => {
				// called once player is loaded
				this.playerDidLoad();
			});
		}

		/**
		 * Intentionally a no-op, documentation that this hook is implemented
		 * and to not error when called by loadPlayer*
		 */
		playerDidLoad (): void {}

		/**
		 * Abstract method which can be overridden by player if needed
		 */
		/**
		 * Sets CSS width and height for the video container.
		 */
		onResize (): void {
			var $container: JQuery = $('.lightbox-content iframe'),
				$lightbox: JQuery = $('.lightbox-wrapper'),
				videoWidth: number = this.params.size.width,
				videoHeight: number = this.params.size.height,
				lightboxWidth: number = $lightbox.width(),
				lightboxHeight: number = $lightbox.height(),
				targetSize: any,
				sanitizedSize: any;

			targetSize = Mercury.Utils.Calculation.containerSize(
				lightboxWidth,
				lightboxHeight,
				videoWidth,
				videoHeight
			);

			// sanitize as our backend sometimes returns size of 0x0
			if (targetSize.width > 0 && targetSize.height > 0) {
				sanitizedSize = {
					width: targetSize.width,
					height: targetSize.height
				};
			} else {
				sanitizedSize = {
					width: '100%',
					height: '100%'
				};
			}

			$container.css(sanitizedSize);
		}

		createUniqueId (id: string): string {
			var element = document.getElementById(id),
			    newId = id + new Date().getTime();

			if (element) {
				element.id = newId;
			}

			return newId;
		}

		track (event = ''): void {
			return M.track({
				label: this.provider,
				category: 'video-player-' + event
			});
		}

	}
}
