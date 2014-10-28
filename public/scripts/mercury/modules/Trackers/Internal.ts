/// <reference path="../../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../utils/track.ts" />

interface InternalTrackingConfig {
	// TODO: These are legacy config values that are terse and very coupled with MW, lets see if we can't
	// deprecate these and use something a bit more appropriate
	// wgCityId
	c: Number;
	// wgDBname
	x: String;
	// wgContentLanguage
	lc: String;
	// trackID || wgTrackID || 0
	u: Number;
	// skin
	s: String;
	// beacon_id || ''
	beacon: String;
	// cachebuster
	cb: Number;
}

interface InternalTrackingParams extends TrackingParams {
	//category
	ga_category: string;
	// wgArticleId
	a: String;
	// wgNamespaceNumber
	n: Number;
}

module Mercury.Modules.Trackers {
	export class Internal {
		baseUrl: string = 'http://a.wikia-beacon.com/__track/';
		callbackTimeout: number = 200;
		success: Function;
		error: Function;
		head: HTMLElement;
		defaults: InternalTrackingConfig;

		constructor () {
			var config = Internal.getConfig();

			this.head = document.head || document.getElementsByTagName('head')[0];
			this.defaults = config;
		}

		static getConfig (): InternalTrackingConfig {
			var mercury = window.Mercury;

			return {
				c: mercury.wiki.id,
				x: mercury.wiki.dbName,
				lc: mercury.wiki.language.user,
				u: 0,
				s: 'mercury',
				beacon: '',
				cb: ~~(Math.random() * 99999)
			};
		}

		static isPageView (category: string): boolean {
			return category.toLowerCase() === 'view';
		}

		private createRequestURL (category: string, params: any): string {
			var parts: string[] = [],
				paramStr: string,
				targetRoute = Internal.isPageView(category) ? 'view' : 'special/trackingevent',
				value: string;

			Object.keys(params).forEach((key: string) => {
				value = params[key];

				if (value != null) {
					paramStr = encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
					parts.push(paramStr);
				}
			});

			return this.baseUrl + targetRoute + '?' + parts.join('&');
		}

		private loadTrackingScript (url: string): void {
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

		track (params: InternalTrackingParams): void {
			var config = <InternalTrackingParams>$.extend(params, this.defaults);

			this.loadTrackingScript(
				this.createRequestURL(config.ga_category, config)
			);
		}

		/**
		 * alias to track a page view
		 */
		trackPageView (context: TrackContext): void {
			this.track(<InternalTrackingParams>$.extend({
				ga_category: 'view'
			}, context));
		}
	}
}
