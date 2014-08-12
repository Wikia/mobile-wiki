module Wikia.Modules {
	export class InternalTracker {
		baseUrl: string;
		callbackTimeout: number;
		success: Function;
		error: Function;
		head: HTMLElement;
		defaults: any;

		constructor(config) {
			this.baseUrl = config.baseUrl;
			this.head = document.head || document.getElementsByTagName('head')[0];
			this.callbackTimeout = config.callbackTimeout || 200;
			this.success = config.success ? config.success : null;
			this.error = config.error ? config.success : null;
			this.defaults = config.defaults || {};
		}

		public track(eventName = 'trackingevent', params = {}) {
			var requestURL,
			    config;

			config = Wikia.Utils.extend(params, this.defaults);

			this.baseUrl += encodeURIComponent(eventName);
			requestURL = this.createRequestURL(config);
			this.loadTrackingScript(requestURL);
		}

		createRequestURL(params) {
			var parts = [],
				paramStr,
				key;

			for (key in params) {
				if (params.hasOwnProperty(key)) {
					paramStr = encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
					parts.push(paramStr);
				}
			}

			return this.baseUrl + '?' + parts.join('&');
		}

		loadTrackingScript(url) {
			var script,
				self;

			self = this;
			script = document.createElement('script');
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
