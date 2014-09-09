/// <reference path="../../../../typings/jquery/jquery.d.ts" />

module Wikia.Modules {

	export class InternalTracker {
		baseUrl: string;
		callbackTimeout: number;
		success: Function;
		error: Function;
		head: HTMLElement;
		defaults: any;

		constructor(config: any) {
			this.baseUrl = config.baseUrl;
			this.head = document.head || document.getElementsByTagName('head')[0];
			this.callbackTimeout = config.callbackTimeout || 200;
			this.success = config.success ? config.success : null;
			this.error = config.error ? config.success : null;
			this.defaults = config.defaults || {};
		}

		public track(eventName: string = 'trackingevent', params: any = {}): void {
			var requestURL: string,
			    config: any;

			config = $.extend(params, this.defaults);
			requestURL = this.createRequestURL(eventName, config);

			this.loadTrackingScript(requestURL);
		}

		createRequestURL(eventName: string, params: any): string {
			var parts: string[] = [],
				paramStr: string;

			Object.keys(params).forEach((key) => {
				paramStr = encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
				parts.push(paramStr);
			});

			return this.baseUrl + eventName + '?' + parts.join('&');
		}

		loadTrackingScript(url: string): void {
			var script = document.createElement('script'),
				self = this;

			script.src = url;

			script.onload = script.onreadystatechange = function (abort) {

				if (!abort || !!script.readyState || !/loaded|complete/.test(script.readyState)) {
					return;
				}

				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;

				// Remove the script
				if (this.head && script.parentNode) {
					this.head.removeChild(script);
				}

				// Dereference the script
				script = undefined;

				if (!abort && typeof self.success === 'function') {
					setTimeout(self.success, self.callbackTimeout);

				} else if (abort && typeof self.error === 'function') {
					setTimeout(self.error, self.callbackTimeout);
				}
			};

			this.head.insertBefore(script, this.head.firstChild);
		}
	}
}
