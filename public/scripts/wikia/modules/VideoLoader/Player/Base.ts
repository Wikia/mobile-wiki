/// <reference path="../../../../baseline/Wikia.d.ts" />

module Wikia.Modules.VideoLoader.Player {
	export class BasePlayer {
		player: any;
		params: any;
		id: string;
		provider: string;
		resourceURI: string;

		constructor (params) {
			this.provider = null;
			this.params = params;
			this.id = params.videoId;
		}

		loadPlayer () {
			return W.load(this.resourceURI, this.playerDidLoad);
		}

		playerDidLoad () {
			/* empty hook */
			console.log(this);
		}

		createUniqueId (id: string) {
			var element = document.getElementById(id),
			    newId = id + new Date().getTime();
			if (element) {
				element.id = newId;
			}
			return newId;
		}
	}
}
