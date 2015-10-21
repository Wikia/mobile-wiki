/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="./VideoPlayers/Base.ts" />
'use strict';

interface PlayerClassMap {
	[index: string]: string;
}

/**
 * @typedef {object} PlayerClassMap
 */

module Mercury.Modules {

	var playerClassMap: PlayerClassMap = {
		youtube: 'YouTube',
		ooyala: 'Ooyala'
	};

	export class VideoLoader {
		data: any;
		player: VideoPlayers.BasePlayer;

		/**
		 * @param {*} data
		 * @returns {undefined}
		 */
		constructor (data: any) {
			this.data = data;
			this.loadPlayerClass();
		}

		/**
		 * @param {string} name
		 * @returns {boolean}
		 */
		private isProvider (name: string): boolean {
			return !!this.data.provider.toLowerCase().match(name);
		}

		/**
		 * Loads player for the video, currently either OoyalaPlayer, YouTubePlayer or BasePlayer (default)
		 *
		 * @returns {undefined}
		 */
		loadPlayerClass () {
			var provider: string = this.getProviderName(),
				playerClassStr: string = (playerClassMap[provider] || 'Base') + 'Player',
				players: any = VideoPlayers,
				params: any = $.extend(this.data.jsParams, {
					size: {
						height: this.data.height,
						width: this.data.width
					}
				});

			this.player = new players[playerClassStr](provider, params);
			this.player.onResize();
		}

		/**
		 * @returns {string}
		 */
		getProviderName () {
			return this.isProvider('ooyala') ? 'ooyala' : this.data.provider;
		}

		/**
		 * @returns {undefined}
		 */
		onResize () {
			this.player.onResize();
		}
	}
}
