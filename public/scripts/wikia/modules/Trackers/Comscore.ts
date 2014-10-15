/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	_comscore: any[];
}

module Wikia.Modules.Trackers {
	export class Comscore extends BaseTracker {
		private static instance: Comscore = null;

		constructor () {
			window._comscore = window._comscore || [];
		}

		url (): string {
			return (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js?" + Math.random();
		}

		/**
		 * Singleton accessor
		 */
		static getInstance (): Comscore {
			if (Comscore.instance === null) {
				Comscore.instance = new Comscore();
			}

			return Comscore.instance;
		}

		trackPageView () {
			var comscore = Wikia.tracking.comscore,
				id =  comscore.id,
				c7Value = comscore.c7Value;

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
