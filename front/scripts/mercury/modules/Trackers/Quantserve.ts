/// <reference path="../../../../../typings/ember/ember.d.ts" />
/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	_qevents: any[];
	__qc: any;
}

module Mercury.Modules.Trackers {
	export class Quantserve extends BaseTracker {
		/**
		 * @returns {undefined}
		 */
		constructor () {
			window._qevents = [];
			super();
			this.usesAdsContext = true;
		}

		/**
		 * @returns {string}
		 */
		url (): string {
			return (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js?" + Math.random();
		}

		/**
		 * @returns {undefined}
		 */
		trackPageView (): void {
			var quantcastLabels = ['Category.MobileWeb.Mercury'];

			if (Mercury.wiki.vertical) {
				quantcastLabels.unshift(Mercury.wiki.vertical);
			}

			//without this quantserve does not want to track 2+ page view
			window.__qc = null;

			window._qevents = [{
				qacct: M.prop('tracking.quantserve'),
				labels: quantcastLabels.join(',')
			}];

			this.appendScript();
		}
	}
}
