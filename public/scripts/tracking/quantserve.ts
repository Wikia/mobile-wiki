/// <reference path="../baseline/mercury.d.ts" />
'use strict';

interface Window {
	_qevents: any[];
}

module Mercury.Utils.Tracking.Quantserve {
	var elem = document.createElement('script'),
		script: HTMLScriptElement;

	window._qevents = window._qevents || [];

	elem.async = true;
	elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";

	script = document.getElementsByTagName('script')[0];
	script.parentNode.insertBefore(elem, script);

	export function track () {
		var context = Mercury.article.adsContext.targeting,
			quantcastLabels = '',
			keyValues: string[],
			keyValue: string[];

		if (context.wikiCategory) {
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

		//quantcastLabels += ',mobilebrowser';
		window._qevents.push({
			qacct: Mercury.tracking.quantserve,
			labels: quantcastLabels
		});
	}
}
