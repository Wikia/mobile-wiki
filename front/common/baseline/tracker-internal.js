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

(function (M) {
	const baseUrl = 'https://beacon.wikia-services.com/__track/';

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
	 * @param {string} category
	 * @returns {boolean}
	 */
	function isPageView(category) {
		return category.toLowerCase() === 'view';
	}

	/**
	 * @param {string} targetRoute
	 * @param {*} params
	 * @returns {string}
	 */
	function createRequestURL(targetRoute, params) {
		const parts = [];

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
	 * @param {InternalTrackingParams} params
	 * @returns {void}
	 */
	function track(params) {
		const config = $.extend(params, getConfig());
		var targetRoute;

		if (params.targetRoute) {
			targetRoute = params.targetRoute;

			delete params.targetRoute;
		} else {
			targetRoute = isPageView(config.ga_category) ? 'view' : 'special/trackingevent';
		}

		$script(createRequestURL(targetRoute, config));
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
		track,
		trackPageView,
		// those are needed for unit test
		_createRequestURL: createRequestURL
	};
})(M);
