/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="./VideoPlayers/Base.ts" />
'use strict';

interface PlayerClassMap {
	[index: string]: string;
}

module Mercury.Modules {

	var playerClassMap: PlayerClassMap = {
		youtube: 'YouTube',
		ooyala: 'Ooyala'
	};

	export class VideoLoader {
		element: HTMLElement;
		data: any;
		player: VideoPlayers.BasePlayer;

		constructor (element: HTMLElement, data: any /* tracking cb */) {
			element.innerHTML = data.html;
			this.element = element;
			this.data = data;
			this.setCssClass();
			this.loadPlayerClass();
		}

		private isProvider (name: string): boolean {
			return !!this.data.provider.toLowerCase().match(name);
		}

		loadPlayerClass () {
			var provider = this.isProvider('ooyala') ? 'ooyala' : this.data.provider,
				playerClassStr = playerClassMap[provider] + 'Player',
				players: any = VideoPlayers,
				params: any = $.extend(this.data.jsParams, {
					size: {
						height: this.data.height,
						width: this.data.width
					}
				});

			// don't attempt to load controls for unsupported player classes
			if (!playerClassMap[provider]) {
				this.player = null;
				return false;
			}

			this.player = new players[playerClassStr](provider, params);
		}

		setCssClass () {
			var provider = this.isProvider('ooyala') ? 'ooyala' : this.data.provider;
			$(this.element).addClass('video-provider-' + provider);
		}
	}
}
