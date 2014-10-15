/// <reference path="../../../baseline/Wikia.d.ts" />

'use strict';

interface Window {
	_comscore: any[];
}

module Wikia.Modules.Trackers {
	export class Comscore {
		private static instance: Comscore = null;
		script: HTMLScriptElement;
		elem: HTMLScriptElement;

		constructor () {
			window._comscore = window._comscore || [];

			this.script = document.getElementsByTagName('script')[0];
		}

		appendScript () {
			var elem = document.createElement('script');

			elem.async = true;
			elem.src = this.url();

			this.elem = elem;

			this.script.parentNode.insertBefore(this.elem, this.script);
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
