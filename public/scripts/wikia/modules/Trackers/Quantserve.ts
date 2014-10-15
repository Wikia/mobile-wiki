/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	_qevents: any[];
	__qc: any;
}

module Wikia.Modules.Trackers {
	export class Quantserve extends BaseTracker {
		private static instance: Quantserve = null;

		constructor () {
			window._qevents = [];
		}

		url (): string {
			return (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js?" + Math.random();
		}

		/**
		 * Singleton accessor
		 */
		static getInstance (): Quantserve {
			if (Quantserve.instance === null) {
				Quantserve.instance = new Quantserve();
			}

			return Quantserve.instance;
		}

		trackPageView (article: any) {
			var context = Em.get('Wikia.article.adsContext.targeting'),
				quantcastLabels = '',
				keyValues: string[],
				keyValue: string[];

			if (context && context.wikiCategory) {
				quantcastLabels += context.wikiCategory;

				if (context.wikiCustomKeyValues) {
					keyValues = context.wikiCustomKeyValues.split(';');

					for (var i = 0; i < keyValues.length; i++) {
						keyValue = keyValues[i].split('=');

						if (keyValue.length >= 2) {
							quantcastLabels += ',' + context.wikiCategory + '.' + keyValue[1];
						}
					}
				}
			}

			//without this quantserve does not want to track 2+ page view
			window.__qc = null;

			//quantcastLabels += ',mobilebrowser';
			window._qevents = [{
				qacct: Wikia.tracking.quantserve,
				labels: quantcastLabels
			}];

			this.appendScript();
		}
	}
}
