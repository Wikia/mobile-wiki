/// <reference path="../../../baseline/Wikia.d.ts" />
'use strict';

module Wikia.Modules {
	var playerClassMap = {
		youtube: 'YouTube',
		ooyala: 'Ooyala'
	};

	export class VideoLoader {
		element: HTMLElement;
		data: any;
		trackingTimeout: number;
		player: any;

		constructor (element, data /* tracking cb */) {
			element.innerHTML = data.html;
			this.data = data;
			this.loadPlayerClass();
		}

		static Player: any;

		public loadPlayerClass () {
			var provider = !this.isProviderOoyala ? this.data.provider : 'ooyala',
				playerClassStr = playerClassMap[provider] + 'Player';
			this.player = new Wikia.Modules.VideoLoader.Player[playerClassStr](this.data.jsParams);
		}

		private isProviderOoyala () {
			var hasParts = this.data.provider.match('/');
			return hasParts ? (hasParts[0].toLowerCase() === 'ooyala' ? true : false ) : false;
		}
	}
}
