/// <reference path="../../../baseline/Wikia.d.ts" />
'use strict';
console.log('lol')
/**
 * Base class for trackers that have to append their scripts like Comscore or Quantserve
 */
module Wikia.Modules.Trackers {
	export class BaseTracker {
		static script: HTMLScriptElement = document.getElementsByTagName('script')[0];

		appendScript () {
			var elem = document.createElement('script');

			elem.async = true;
			elem.src = this.url();

			BaseTracker.script.parentNode.insertBefore(elem, BaseTracker.script);
		}
	}
}
