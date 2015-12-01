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

/**
 * @typedef {Object} InternalTrackingParams
 * @property {string} ga_category - category
 * @property {string} a - wgArticleId
 * @property {number} n - wgNamespaceNumber
 * @property {string} [sourceUrl]
 */

/**
 * @class Internal
 *
 * @property {string} baseUrl
 * @property {number} callbackTimeout
 * @property {HTMLElement} head
 * @property {InternalTrackingConfig} defaults
 * @property {Function} success
 * @property {Function} error
 */
export default class Internal {
	/**
	 * @returns {void}
	 */
	constructor() {
		this.baseUrl = 'https://beacon.wikia-services.com/__track/';
		this.callbackTimeout = 200;
		this.head = document.head || document.getElementsByTagName('head')[0];
		this.defaults = Internal.getConfig();
	}

	/**
	 * @returns {InternalTrackingConfig}
	 */
	static getConfig() {
		const mercury = window.Mercury;

		return {
			c: mercury.wiki.id,
			x: mercury.wiki.dbName,
			lc: mercury.wiki.language.content,
			u: mercury.userId || 0,
			s: 'mercury',
			beacon: '',
			cb: Math.floor(Math.random() * 99999)
		};
	}

	/**
	 * @param {string} category
	 * @returns {boolean}
	 */
	static isPageView(category) {
		return category.toLowerCase() === 'view';
	}

	/**
	 * @param {string} category
	 * @param {*} params
	 * @returns {string}
	 */
	createRequestURL(category, params) {
		const parts = [],
			targetRoute = Internal.isPageView(category) ? 'view' : 'special/trackingevent';

		Object.keys(params).forEach((key) => {
			const value = params[key];

			if (value !== null) {
				const paramStr = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

				parts.push(paramStr);
			}
		});

		return `${this.baseUrl}${targetRoute}?${parts.join('&')}`;
	}

	/**
	 * @param {boolean} abort
	 * @param {HTMLScriptElement} script
	 * @returns {void}
	 */
	scriptLoadedHandler(abort, script) {

		if (!abort || script.readyState || !(/loaded|complete/).test(script.readyState)) {
			return;
		}

		// Handle memory leak in IE
		script.onload = script.onreadystatechange = null;

		// Remove the script
		if (this.head && script.parentNode) {
			this.head.removeChild(script);
		}

		if (!abort && typeof this.success === 'function') {
			setTimeout(this.success, this.callbackTimeout);

		} else if (abort && typeof this.error === 'function') {
			setTimeout(this.error, this.callbackTimeout);
		}
	}

	/**
	 * @param {string} url
	 * @param {Element} [script=document.createElement('script')]
	 * @returns {void}
	 */
	loadTrackingScript(url, script = document.createElement('script')) {
		script.src = url;
		script.onload = script.onreadystatechange = (abort) => {
			this.scriptLoadedHandler(abort, script);
		};

		this.head.insertBefore(script, this.head.firstChild);
	}

	/**
	 * @param {InternalTrackingParams} params
	 * @returns {void}
	 */
	track(params) {
		const config = $.extend(params, this.defaults);

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
	trackPageView(context) {
		this.track($.extend({
			ga_category: 'view'
		}, context));
	}
}
