/// <reference path="../../../../baseline/Wikia.d.ts" />
/// <reference path="./Base.ts" />

interface Window {
	OO: {
		Player: {
			create: (
				 container: string,
				 videoId: string,
				 params: any
				 ) => void
		}
	}
}

module Wikia.Modules.VideoLoader.Player {
	
	export class OoyalaPlayer extends BasePlayer {
		constructor (params) {
			super(params);
			this.setupPlayer();
		}

		// a bit ambiguous based on legacy return, but the first file is the
		// Ooyala embedded API, the second is AgeGate
		public resourceURI = this.params.jsFile[0];
		// Ooyala JSON payload contains a DOM id
		public containerId = this.createUniqueId(this.params.playerId);

		setupPlayer (): void {
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
	}
}

