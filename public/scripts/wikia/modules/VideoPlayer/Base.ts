/// <reference path="../../../baseline/Wikia.d.ts" />

module Wikia.Modules.VideoPlayer {
	export class BasePlayer {
		player: any;
		params: any;
		id: string;
		provider: string;
		resourceURI: string;

		constructor (provider: string, params: any) {
			this.provider = provider;
			this.params = params;
			this.id = params.videoId;
		}

		loadPlayer () {
			return W.load(this.resourceURI, () => {
				// hook to be called once player is loaded
				this.playerDidLoad();
			});
		}

		playerDidLoad (): void {
			/* intentionally a no-op */
		}

		createUniqueId (id: string): string {
			var element = document.getElementById(id),
			    newId = id + new Date().getTime();
			if (element) {
				element.id = newId;
			}
			return newId;
		}

		track (event: string, params?: any) {
			var opts = {
				trackingMethod: 'both',
				label: this.provider,
				category: 'video-player'
			};
			params = $.extend(opts, params);
			return W.track(event, opts);
		}

	}
}
