/**
 * Caching related routines
 */

/**
 * @typedef {Object} CachingIntervals
 * @property {number} long
 * @property {number} standard
 * @property {number} short
 * @property {number} disabled
 * @property {number} default
 */

/**
 * @typedef {Object} CachingPolicy
 */

/**
 * @typedef {Object} CachingSettings
 * @property {boolean} enabled
 * @property {CachingPolicy} cachingPolicy
 * @property {number} varnishTTL
 * @property {number} browserTTL
 */

const Caching = {
	Policy: {
		Private: 0,
		Public: 1
	},

	// Caching expire intervals
	Interval: {
		// 30 days in seconds
		long: 2.592e+6,
		// 24h in seconds
		standard: 8.64e+4,
		// 3h in seconds
		short: 1.08e+4,
		// disabled
		disabled: 0,
		// default
		default: -1
	},

	/**
	 * Sets proper headers to the response object
	 *
	 * Ported from https://github.com/Wikia/app/blob/dev/includes/wikia/nirvana/WikiaResponse.class.php#L309
	 *
	 * @param {Hapi.Response} response
	 * @param {CachingSettings} cachingSettings
	 * @returns {void}
	 */
	setResponseCaching(response, cachingSettings) {
		if (cachingSettings && cachingSettings.enabled && response.statusCode === 200) {

			if (cachingSettings.browserTTL === Caching.Interval.default) {
				cachingSettings.browserTTL = cachingSettings.varnishTTL;
			}
			if (cachingSettings.cachingPolicy === Caching.Policy.Public) {
				// Varnish caches for 5 seconds when Apache sends Cache-Control: public, s-maxage=0
				// perform this logic here
				if (cachingSettings.varnishTTL === Caching.Interval.disabled) {
					cachingSettings.varnishTTL = 5;
				}

				response.header('Cache-Control',
					`s-maxage=${cachingSettings.varnishTTL}`);
			} else if (cachingSettings.cachingPolicy === Caching.Policy.Private) {
				response.header('Cache-Control',
					`private, s-maxage=${cachingSettings.varnishTTL}`);
			}
			if (cachingSettings.browserTTL > 0) {
				response.header('X-Pass-Cache-Control',
					`${Caching.policyString(cachingSettings.cachingPolicy)}, max-age=${cachingSettings.browserTTL}`);
			}
		}
	},

	/**
	 * Returns string representation of the caching policy constant
	 *
	 * @param {CachingPolicy} policy
	 * @returns {string}
	 */
	policyString(policy) {
		return Caching.Policy[policy].toLowerCase();
	},

	/**
	 * Disables use of cache in the response
	 *
	 * @param {Hapi.Response} response
	 * @returns {void}
	 */
	disableCache(response) {
		response.header('Cache-Control', 'private, s-maxage=0, max-age=0, must-revalidate');
	}
};

exports.Caching = Caching;
