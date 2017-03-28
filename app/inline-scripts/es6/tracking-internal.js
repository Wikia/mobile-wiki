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
		const wikiVariables = M.getFromShoebox('wikiVariables');

		return {
			c: wikiVariables.id,
			x: wikiVariables.dbName,
			lc: wikiVariables.language.content,
			u: parseInt(M.getFromShoebox('userId'), 10) || 0,
			s: 'mercury',
			beacon: '',
			cb: Math.floor(Math.random() * 99999)
		};
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
	 * @param {string} targetRoute
	 * @param {InternalTrackingParams} params
	 * @returns {void}
	 */
	function track(targetRoute, params) {
		const config = M.simpleExtend(params, getConfig());

		M.loadScript(createRequestURL(targetRoute, config));
	}

	/**
	 * @param {TrackContext} context
	 * @returns {void}
	 */
	function trackPageView(context) {
		track('view', M.simpleExtend({
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

	if (!M.getFromShoebox('runtimeConfig.noExternals')) {
		M.tracker.Internal.trackPageView({
			a: M.getFromShoebox('wikiPage.data.details.id'),
			n: M.getFromShoebox('wikiPage.data.ns')
		});
	}
})(window.M);
