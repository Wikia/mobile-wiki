/// <reference path="../../../baseline/mercury.d.ts" />
'use strict';

/**
 * Base class for trackers that have to append their scripts like Comscore or Quantserve
 */
module Mercury.Modules.Trackers {
	export class BaseTracker {
		static script: HTMLScriptElement = document.getElementsByTagName('script')[0];

		//This method should overridden implemented by a tracker
		url (): string {
			return '';
		}

		appendScript (): void {
			var elem: HTMLScriptElement = document.createElement('script');

			elem.async = true;
			elem.src = this.url();

			BaseTracker.script.parentNode.insertBefore(elem, BaseTracker.script);
		}
	}
}
