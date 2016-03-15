if (typeof window.M === 'undefined') {
	window.M = {};
}
if (typeof window.M.tracker === 'undefined') {
	window.M.tracker = {};
}
/* eslint-disable no-console */
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

(function (M) {
	const baseUrl = 'https://beacon.wikia-services.com/__track/',
		callbackTimeout = 200,
		head = document.head || document.getElementsByTagName('head')[0];

	let defaults;

	/**
	 * @returns {InternalTrackingConfig}
	 */
	function getConfig() {
		const mercury = window.Mercury;

		return {
			c: mercury.wiki.id,
			x: mercury.wiki.dbName,
			lc: mercury.wiki.language.content,
			u: parseInt(M.prop('userId'), 10) || 0,
			s: 'mercury',
			beacon: '',
			cb: Math.floor(Math.random() * 99999)
		};
	}

	/**
	 * @returns {void}
	 */
	function initialize() {
		defaults = getConfig();
	}

	/**
	 * @param {string} category
	 * @returns {boolean}
	 */
	function isPageView(category) {
		return category.toLowerCase() === 'view';
	}

	/**
	 * @param {string} category
	 * @param {*} params
	 * @returns {string}
	 */
	function createRequestURL(category, params) {
		const parts = [],
			targetRoute = isPageView(category) ? 'view' : 'special/trackingevent';

		Object.keys(params).forEach((key) => {
			const value = params[key];

			if (value !== null) {
				const paramStr = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

				parts.push(paramStr);
			}
		});

		return `${baseUrl}${targetRoute}?${parts.join('&')}`;
	}

	/**
	 * @param {boolean} abort
	 * @param {HTMLScriptElement} script
	 * @returns {void}
	 */
	function scriptLoadedHandler(abort, script) {
		if (!abort || script.readyState || !(/loaded|complete/).test(script.readyState)) {
			return;
		}

		// Handle memory leak in IE
		script.onload = script.onreadystatechange = null;

		// Remove the script
		if (head && script.parentNode) {
			head.removeChild(script);
		}

		if (!abort && typeof onSuccess === 'function') {
			setTimeout(onSuccess, callbackTimeout);

		} else if (abort && typeof onError === 'function') {
			setTimeout(onError, callbackTimeout);
		}
	}

	/**
	 * @param {string} url
	 * @param {Element} [script=document.createElement('script')]
	 * @returns {void}
	 */
	function loadTrackingScript(url, script = document.createElement('script')) {
		script.src = url;
		script.onload = script.onreadystatechange = (abort) => {
			scriptLoadedHandler(abort, script);
		};

		head.insertBefore(script, head.firstChild);
	}

	/**
	 * @param {InternalTrackingParams} params
	 * @returns {void}
	 */
	function track(params) {
		const config = $.extend(params, defaults);

		loadTrackingScript(
			createRequestURL(config.ga_category, config)
		);
	}

	/**
	 * @param {TrackContext} context
	 * @returns {void}
	 */
	function trackPageView(context) {
		track($.extend({
			ga_category: 'view'
		}, context));

		console.info('Track pageView: Internal');
	}


	// API
	M.tracker.Internal = {
		initialize,
		track,
		trackPageView
	};
})(M);
