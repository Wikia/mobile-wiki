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

export const Policy = {
		Private: 'private',
		Public: 'public'
	},
	// Caching expire intervals
	Interval = {
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
	};

/**
 * Disables use of cache in the response
 *
 * @param {Hapi.Response} response
 * @returns {void}
 */
export function disableCache(response) {
	response.header('Cache-Control', 'private, s-maxage=0, max-age=0, must-revalidate');
}

/**
 * Sets proper headers to the response object
 *
 * Ported from https://github.com/Wikia/app/blob/dev/includes/wikia/nirvana/WikiaResponse.class.php#L309
 *
 * @param {Hapi.Response} response
 * @param {CachingSettings} cachingSettings
 * @returns {void}
 */
export default function setResponseCaching(response, cachingSettings) {
	if (cachingSettings && cachingSettings.enabled && response.statusCode === 200) {
		if (cachingSettings.browserTTL === Interval.default) {
			cachingSettings.browserTTL = cachingSettings.varnishTTL;
		}

		if (cachingSettings.cachingPolicy === Policy.Public) {
			// Varnish caches for 5 seconds when Apache sends Cache-Control: public, s-maxage=0
			// perform this logic here
			if (cachingSettings.varnishTTL === Interval.disabled) {
				cachingSettings.varnishTTL = 5;
			}

			response.header('Cache-Control',
				`s-maxage=${cachingSettings.varnishTTL}`);
		} else if (cachingSettings.cachingPolicy === Policy.Private) {
			response.header('Cache-Control',
				`private, s-maxage=${cachingSettings.varnishTTL}`);
		}

		if (cachingSettings.browserTTL > 0) {
			response.header('X-Pass-Cache-Control',
				`${cachingSettings.cachingPolicy}, max-age=${cachingSettings.browserTTL}`);
		}
	}
}
