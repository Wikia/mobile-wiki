/// <reference path="../../../../typings/jquery/jquery.d.ts" />

module Wikia.Modules {

	export class InternalTracker {
		private static instance: Wikia.Modules.InternalTracker = null;
		baseUrl: string;
		callbackTimeout: number;
		success: Function;
		error: Function;
		head: HTMLElement;
		defaults: any;

		constructor (config: any) {
			this.baseUrl = config.baseUrl;
			this.head = document.head || document.getElementsByTagName('head')[0];
			this.callbackTimeout = config.callbackTimeout || 200;
			this.success = config.success ? config.success : null;
			this.error = config.error ? config.success : null;
			this.defaults = config.defaults || {};
		}

		/**
		 * Singleton accessor
		 *
		 * @param {Object} config
		 * @returns {InternalTracker}
		 */
		public static getInstance (config: any): Wikia.Modules.InternalTracker {
			if (InternalTracker.instance === null) {
				InternalTracker.instance = new Wikia.Modules.InternalTracker(config);
			}
			return InternalTracker.instance;
		}

		public track (params: any = {}): void {
			var requestURL: string,
			    config: any;

			config = $.extend(params, this.defaults);
			requestURL = this.createRequestURL(config);

			this.loadTrackingScript(requestURL);
		}

		createRequestURL (params: any): string {
			var parts: string[] = [],
				paramStr: string,
				targetRoute = 'special/trackingevent';

			Object.keys(params).forEach((key) => {
				paramStr = encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
				parts.push(paramStr);
			});

			return this.baseUrl + targetRoute + '?' + parts.join('&');
		}

		loadTrackingScript (url: string): void {
			var script = document.createElement('script');

			script.src = url;

			script.onload = script.onreadystatechange = (abort: any): void => {

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

				if (!abort && typeof this.success === 'function') {
					setTimeout(this.success, this.callbackTimeout);

				} else if (abort && typeof this.error === 'function') {
					setTimeout(this.error, this.callbackTimeout);
				}
			};

			this.head.insertBefore(script, this.head.firstChild);
		}
	}
}
