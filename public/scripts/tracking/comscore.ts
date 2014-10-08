/// <reference path="../baseline/Wikia.d.ts" />

'use strict';

interface Window {
	_comscore: any[];
}

module Wikia.Utils.Tracking.Comscore {
	var elem = document.createElement('script'),
		script: HTMLScriptElement;

	window._comscore = window._comscore || [];

	elem.async = true;
	elem.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";

	script = document.getElementsByTagName('script')[0];

	export function track () {
		var comscore = Wikia.tracking.comscore,
			id =  comscore.id,
			c7 = comscore.c7;

		window._comscore.push({
			c1: '2',
			c2: id,
			options: {
				url_append: id + '=' + c7
			}
		});

		console.log(window._comscore)
		//script.parentNode.insertBefore(elem, script);
	}
}
