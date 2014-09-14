/// <reference path="../../../baseline/Wikia.d.ts" />
'use strict';

interface PlayerClassMap {
	[index: string]: string;
}
module Wikia.Modules {

	var playerClassMap: PlayerClassMap = {
		youtube: 'YouTube',
		ooyala: 'Ooyala'
	};

	export class VideoLoader {
		element: HTMLElement;
		data: any;
		trackingTimeout: number;
		player: any;

		constructor (element: HTMLElement, data: any /* tracking cb */) {
			element.innerHTML = data.html;
			this.data = data;
			this.loadPlayerClass();
		}

		static Player: any;

		public loadPlayerClass () {
			var provider: string = this.isProviderOoyala() ? 'ooyala' : this.data.provider,
				playerClassStr = playerClassMap[provider] + 'Player';
			this.player = new Wikia.Modules.VideoPlayer[playerClassStr](this.data.jsParams);
		}

		private isProviderOoyala () {
			return !!this.data.provider.toLowerCase().match('ooyala');
		}
	}
}
