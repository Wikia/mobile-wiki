/// <reference path="../../../baseline/Wikia.d.ts" />
'use strict';

module Wikia.Modules {
	var playerClassMap = {
		youtube: 'YouTube'
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
			var playerClassStr = playerClassMap[this.data.provider.toLowerCase()] + 'Player';
			this.player = new Wikia.Modules.VideoLoader.Player[playerClassStr](this.data.jsParams);
		}

	}
}
