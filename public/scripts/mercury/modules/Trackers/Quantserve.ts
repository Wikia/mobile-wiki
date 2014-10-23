/// <reference path="../../../../../typings/ember/ember.d.ts" />
/// <reference path="./BaseTracker.ts" />
'use strict';

interface Window {
	_qevents: any[];
	__qc: any;
}

module Mercury.Modules.Trackers {
	export class Quantserve extends BaseTracker {
		constructor () {
			window._qevents = [];
			super();
		}

		url (): string {
			return (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js?" + Math.random();
		}

		trackPageView (): void {
			var context: typeof Mercury.tracking = this.getContext(),
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
				qacct: Mercury.tracking.quantserve,
				labels: quantcastLabels
			}];

			this.appendScript();
		}

		getContext (): any {
			return Em.get('Mercury.article.adsContext.targeting');
		}
	}
}
