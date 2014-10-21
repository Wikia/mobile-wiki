/// <reference path="../../../baseline/mercury.d.ts" />

module Mercury.Modules.VideoPlayer {
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
		}

		loadPlayer () {
			return M.load(this.resourceURI, () => {
				// called once player is loaded
				this.playerDidLoad();
			});
		}

		playerDidLoad (): void {
			// intentionally a no-op, documentation that this hook is implemented and to
			// not error when called by loadPlayer*
		}

		createUniqueId (id: string): string {
			var element = document.getElementById(id),
			    newId = id + new Date().getTime();
			if (element) {
				element.id = newId;
			}
			return newId;
		}

		track (event: string, params?: any): Function {
			var opts = {
				label: this.provider,
				category: 'video-player',
				action: event
			};
			params = $.extend(opts, params);
			return M.track(opts);
		}

	}
}
