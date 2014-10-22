/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	_comscore: any[];
}

module Wikia.Modules.Trackers {
	export class Comscore extends BaseTracker {
		constructor () {
			window._comscore = window._comscore || [];
			super();
		}

		url (): string {
			return (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js?" + Math.random();
		}

		trackPageView (): void {
			var comscore = Wikia.tracking.comscore,
				id: string =  comscore.id,
				c7Value: string = comscore.c7Value;

			window._comscore.push({
				c1: '2',
				c2: id,
				options: {
					url_append: id + '=' + c7Value
				}
			});

			this.appendScript();
		}
	}
}
