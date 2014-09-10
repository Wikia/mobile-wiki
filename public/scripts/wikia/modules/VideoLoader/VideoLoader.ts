/// <reference path="../../../baseline/Wikia.d.ts" />
'use strict';

module Wikia.Modules {
	export class VideoLoader {
		element: HTMLElement;
		data: any;
		trackingTimeout: number;
		playerClassMap: any;

		constructor (element, data /* tracking cb */) {
			element.innerHTML = data.html;
			this.data = data;
			this.loadPlayerClass();
		}

		static Player: any;

		public loadPlayerClass () {
			var player = new Wikia.Modules.VideoLoader.Player.YouTubePlayer(this.data.jsParams);
		}

	}
}
