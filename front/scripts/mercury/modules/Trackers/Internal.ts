/// <reference path="../../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../utils/track.ts" />
/// <reference path="../../utils/queryString.ts" />

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

/**
 * @typedef {Object} InternalTrackingConfig
 * @property {number} c - wgCityId
 * @property {string} x - wgDBName
 * @property {string} lc - wgContentLanguage
 * @property {number} u=0 - trackID || wgTrackID || 0
 * @property {string} s - skin
 * @property {string} beacon='' - beacon_id || ''
 * @property {number} cb - cachebuster
 */

interface InternalTrackingParams extends TrackingParams {
	//category
	ga_category: string;
	// wgArticleId
	a: String;
	// wgNamespaceNumber
	n: Number;
	sourceUrl?: string;
}

/**
 * @typedef {Object} InternalTrackingParams
 * @property {string} ga_category - category
 * @property {string} a - wgArticleId
 * @property {number} n - wgNamespaceNumber
 * @property {string} [sourceUrl]
 */

module Mercury.Modules.Trackers {
	export class Internal {
		baseUrl: string = 'https://beacon.wikia-services.com/__track/';
		callbackTimeout: number = 200;
		success: Function;
		error: Function;
		head: HTMLElement;
		defaults: InternalTrackingConfig;
		script: any;

		/**
		 * @returns {void}
		 */
		constructor () {
			var config = Internal.getConfig();

			this.head = document.head || document.getElementsByTagName('head')[0];
			this.defaults = config;
		}

		/**
		 * @returns {InternalTrackingConfig}
		 */
		static getConfig (): InternalTrackingConfig {
			var mercury = window.Mercury,
				config: InternalTrackingConfig = {
					c: mercury.wiki.id,
					x: mercury.wiki.dbName,
					lc: mercury.wiki.language.content,
					u: mercury.userId || 0,
					s: 'mercury',
					beacon: '',
					cb: ~~(Math.random() * 99999)
				};

			return config;
		}

		/**
		 * @param {string} category
		 * @returns {boolean}
		 */
		static isPageView (category: string): boolean {
			return category.toLowerCase() === 'view';
		}

		/**
		 * @param {string} category
		 * @param {*} params
		 * @returns {string}
		 */
		createRequestURL (category: string, params: any): string {
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

		scriptLoadedHandler(abort: any): void {

			if (!abort || !!this.script.readyState || !/loaded|complete/.test(this.script.readyState)) {
				return;
			}

			// Handle memory leak in IE
			this.script.onload = this.script.onreadystatechange = null;

			// Remove the script
			if (this.head && this.script.parentNode) {
				this.head.removeChild(this.script);
			}

			// Dereference the script
			this.script = undefined;

			if (!abort && typeof this.success === 'function') {
				setTimeout(this.success, this.callbackTimeout);

			} else if (abort && typeof this.error === 'function') {
				setTimeout(this.error, this.callbackTimeout);
			}
		}

		/**
		 * @param {string} url
		 * @returns {void}
		 */
		loadTrackingScript (url: string): void {
			this.script = document.createElement('script');

			this.script.src = url;

			this.script.onload = this.script.onreadystatechange = (abort: any) => {
				this.scriptLoadedHandler(abort);
			};

			this.head.insertBefore(this.script, this.head.firstChild);
		}


		/**
		 * @param {InternalTrackingParams} params
		 * @returns {void}
		 */
		track (params: InternalTrackingParams): void {
			var config = <InternalTrackingParams>$.extend(params, this.defaults);

			this.loadTrackingScript(
				this.createRequestURL(config.ga_category, config)
			);
		}

		/**
		 * Alias to track a page view
		 *
		 * @param {TrackContext} context
		 * @returns {void}
		 */
		trackPageView (context: TrackContext): void {
			this.track(<InternalTrackingParams>$.extend({
				ga_category: 'view'
			}, context));
		}
	}
}
