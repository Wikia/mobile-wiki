/// <reference path="../../../../../typings/jquery/jquery.d.ts" />

interface InternalTrackingConfig {
	// TODO: These are legacy config values that are terse and very coupled with MW, lets see if we can't
	// deprecate these and use something a bit more appropriate
	// wgCityId
	c: Number;
	// wgDBname
	x: String;
	// wgArticleId
	a: String;
	// wgContentLanguage
	lc: String;
	// wgNamespaceNumber
	n: Number;
	// trackID || wgTrackID || 0
	u: Number;
	// skin
	s: String;
	// beacon_id || ''
	beacon: String;
	// cachebuster
	cb: Number;
}

module Wikia.Modules.Trackers {

	export class Internal {
		private static instance: Internal = null;
		baseUrl: string = 'http://a.wikia-beacon.com/__track/';
		callbackTimeout: number = 200;
		success: Function;
		error: Function;
		head: HTMLElement;
		defaults: any;

		constructor () {
			var config = Internal.getConfig();

			this.head = document.head || document.getElementsByTagName('head')[0];
			this.success = config.success ? config.success : null;
			this.error = config.error ? config.success : null;
			this.defaults = config.defaults || {};
		}

		static getConfig () {
			var wikia = window.Wikia;

			return {
				c: wikia.wiki.id,
				x: wikia.wiki.dbName,
				a: wikia.article.details.title,
				lc: wikia.wiki.language,
				n: wikia.article.details.ns,
				u: 0,
				s: 'mercury',
				beacon: '',
				cb: ~~(Math.random() * 99999)
			};
		}

		static isPageView (eventName: string): boolean {
			return eventName.toLowerCase() === 'view';
		}

		createRequestURL (eventName: string, params: any): string {
			var parts: string[] = [],
				paramStr: string,
				targetRoute = Internal.isPageView(eventName) ? 'view' : 'special/trackingevent';

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

		/**
		 * Singleton accessor
		 *
		 * @param {Object} config
		 * @returns {InternalTracker}
		 */
		public static getInstance (): Internal {
			if (Internal.instance === null) {
				Internal.instance = new Internal();
			}

			return Internal.instance;
		}

		public track (eventName: string = 'trackingevent', params: any = {}): void {
			var requestURL: string,
				config: any;

			config = $.extend(params, this.defaults);
			requestURL = this.createRequestURL(eventName, config);

			this.loadTrackingScript(requestURL);
		}

		public trackPageView () {
			this.track('view');
		}
	}
}
